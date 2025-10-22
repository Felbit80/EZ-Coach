import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { Team, TeamMember } from "../types";
import { useAuth } from "./AuthContext";

interface TeamContextData {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  loading: boolean;
  selectTeam: (team: Team) => void;
  createTeam: (team: Omit<Team, "id" | "created_at" | "updated_at" | "created_by">) => Promise<Team>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  loadTeams: () => Promise<void>;
  inviteMember: (teamId: string, email: string, role: TeamMember["role"]) => Promise<void>;
}

const TeamContext = createContext<TeamContextData>({} as TeamContextData);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      loadTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  const loadTeams = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // PRIMEIRO: Busca times onde o usuário é o criador
      const { data: ownedTeams, error: ownedError } = await supabase.from("teams").select("*").eq("created_by", user.id);

      if (ownedError) throw ownedError;

      // SEGUNDO: Busca times onde o usuário é membro
      const { data: memberTeams, error: memberError } = await supabase.from("team_members").select("team_id").eq("user_id", user.id);

      if (memberError) throw memberError;

      // Se o usuário é membro de outros times, busca os dados desses times
      let teamsWhereMember: Team[] = [];
      if (memberTeams && memberTeams.length > 0) {
        const teamIds = memberTeams.map((member) => member.team_id);
        const { data: memberTeamData, error: memberTeamError } = await supabase.from("teams").select("*").in("id", teamIds);

        if (memberTeamError) throw memberTeamError;
        teamsWhereMember = memberTeamData || [];
      }

      // Combina os dois resultados, removendo duplicatas
      const allTeams = [...(ownedTeams || []), ...teamsWhereMember];
      const uniqueTeams = allTeams.filter((team, index, self) => index === self.findIndex((t) => t.id === team.id));

      // Ordena por data de criação
      uniqueTeams.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTeams(uniqueTeams);

      if (uniqueTeams.length > 0 && !currentTeam) {
        setCurrentTeam(uniqueTeams[0]);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase.from("team_members").select("*").eq("team_id", teamId);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const selectTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  const createTeam = async (teamData: Omit<Team, "id" | "created_at" | "updated_at" | "created_by">) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("teams")
      .insert({
        ...teamData,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as coach
    await supabase.from("team_members").insert({
      team_id: data.id,
      user_id: user.id,
      role: "coach",
    });

    await loadTeams();
    return data;
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    const { error } = await supabase.from("teams").update(updates).eq("id", id);

    if (error) throw error;
    await loadTeams();
  };

  const deleteTeam = async (id: string) => {
    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) throw error;
    await loadTeams();
  };

  const inviteMember = async (teamId: string, email: string, role: TeamMember["role"]) => {
    try {
      // Busca o usuário pelo email
      const { data: userData, error: userError } = await supabase.from("users").select("id").eq("email", email).single();

      if (userError) {
        if (userError.code === "PGRST116") {
          throw new Error("Usuário não encontrado com este email");
        }
        throw userError;
      }

      if (!userData) {
        throw new Error("Usuário não encontrado");
      }

      // Verifica se o usuário já é membro do time
      const { data: existingMember, error: checkError } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .eq("user_id", userData.id)
        .single();

      if (existingMember) {
        throw new Error("Este usuário já é membro do time");
      }

      // Adiciona como membro
      const { error: insertError } = await supabase.from("team_members").insert({
        team_id: teamId,
        user_id: userData.id,
        role,
      });

      if (insertError) throw insertError;

      // Recarrega os membros
      await loadTeamMembers(teamId);
    } catch (error: any) {
      console.error("Error inviting member:", error);
      throw error;
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        teamMembers,
        loading,
        selectTeam,
        createTeam,
        updateTeam,
        deleteTeam,
        loadTeams,
        inviteMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
