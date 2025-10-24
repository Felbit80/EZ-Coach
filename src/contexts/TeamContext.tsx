import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { Team, TeamMember } from "../types";
import { useAuth } from "./AuthContext";

export interface TeamMemberWithUser extends TeamMember {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

interface TeamContextData {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMemberWithUser[];
  loading: boolean;
  selectTeam: (team: Team) => void;
  createTeam: (team: Omit<Team, "id" | "created_at" | "updated_at" | "created_by">) => Promise<Team>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  loadTeams: () => Promise<void>;
  inviteMember: (teamId: string, email: string, role: TeamMember["role"]) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMember: (memberId: string, updates: Partial<TeamMember>) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  loadEvents: (teamId: string) => Promise<Event[]>;
}

const TeamContext = createContext<TeamContextData>({} as TeamContextData);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithUser[]>([]);
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

      const { data: ownedTeams, error: ownedError } = await supabase.from("teams").select("*").eq("created_by", user.id);

      if (ownedError) throw ownedError;

      const { data: memberTeams, error: memberError } = await supabase.from("team_members").select("team_id").eq("user_id", user.id);

      if (memberError) throw memberError;

      let teamsWhereMember: Team[] = [];
      if (memberTeams && memberTeams.length > 0) {
        const teamIds = memberTeams.map((member) => member.team_id);
        const { data: memberTeamData, error: memberTeamError } = await supabase.from("teams").select("*").in("id", teamIds);

        if (memberTeamError) throw memberTeamError;
        teamsWhereMember = memberTeamData || [];
      }

      const allTeams = [...(ownedTeams || []), ...teamsWhereMember];
      const uniqueTeams = allTeams.filter((team, index, self) => index === self.findIndex((t) => t.id === team.id));

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
      console.log("🔄 Carregando membros do time:", teamId);

      const { data: membersData, error: membersError } = await supabase.from("team_members").select("*").eq("team_id", teamId);

      if (membersError) throw membersError;

      if (!membersData || membersData.length === 0) {
        setTeamMembers([]);
        return;
      }

      const userIds = membersData.map((member) => member.user_id);
      console.log("👥 IDs dos usuários para buscar:", userIds);

      const { data: usersData, error: usersError } = await supabase.from("users").select("id, name, email, avatar_url").in("id", userIds);

      if (usersError) throw usersError;

      console.log("✅ Dados dos usuários encontrados:", usersData);

      const membersWithUserInfo: TeamMemberWithUser[] = membersData.map((member) => {
        const userInfo = usersData?.find((user) => user.id === member.user_id);
        return {
          ...member,
          user: userInfo
            ? {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                avatar_url: userInfo.avatar_url,
              }
            : undefined,
        };
      });

      console.log("🎯 Membros com informações completas:", membersWithUserInfo);
      setTeamMembers(membersWithUserInfo);
    } catch (error) {
      console.error("❌ Erro ao carregar membros do time:", error);
      setTeamMembers([]);
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

      const { data: existingMember, error: checkError } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .eq("user_id", userData.id)
        .single();

      if (existingMember) {
        throw new Error("Este usuário já é membro do time");
      }

      const { error: insertError } = await supabase.from("team_members").insert({
        team_id: teamId,
        user_id: userData.id,
        role,
      });

      if (insertError) throw insertError;

      await loadTeamMembers(teamId);
    } catch (error: any) {
      console.error("Error inviting member:", error);
      throw error;
    }
  };

  const removeMember = async (memberId: string) => {
    if (!currentTeam) throw new Error("Nenhum time selecionado");

    try {
      const { error } = await supabase.from("team_members").delete().eq("id", memberId).eq("team_id", currentTeam.id);

      if (error) throw error;

      await loadTeamMembers(currentTeam.id);
    } catch (error: any) {
      console.error("Error removing member:", error);
      throw error;
    }
  };

  const updateMember = async (memberId: string, updates: Partial<TeamMember>) => {
    try {
      const { error } = await supabase.from("team_members").update(updates).eq("id", memberId);

      if (error) throw error;

      if (currentTeam) {
        await loadTeamMembers(currentTeam.id);
      }
    } catch (error: any) {
      console.error("Error updating member:", error);
      throw error;
    }
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const { error } = await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", user.id);

      if (error) throw error;

      console.log("✅ Usuário saiu do time com sucesso");
      await loadTeams();

      if (currentTeam?.id === teamId) {
        const remainingTeams = teams.filter((team) => team.id !== teamId);
        setCurrentTeam(remainingTeams.length > 0 ? remainingTeams[0] : null);
      }
    } catch (error: any) {
      console.error("❌ Erro ao sair do time:", error);
      throw error;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      const { error } = await supabase.from("events").update(updates).eq("id", eventId);

      if (error) throw error;

      console.log("✅ Evento atualizado com sucesso");
      if (currentTeam) {
        await loadEvents(currentTeam.id);
      }
    } catch (error: any) {
      console.error("❌ Erro ao atualizar evento:", error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", eventId);

      if (error) throw error;

      console.log("✅ Evento excluído com sucesso");
      if (currentTeam) {
        await loadEvents(currentTeam.id);
      }
    } catch (error: any) {
      console.error("❌ Erro ao excluir evento:", error);
      throw error;
    }
  };

  const loadEvents = async (teamId: string) => {
    try {
      const { data, error } = await supabase.from("events").select("*").eq("team_id", teamId).order("start_date", { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error("Erro ao carregar eventos:", error);
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
        removeMember,
        updateMember,
        leaveTeam,
        updateEvent,
        deleteEvent,
        loadEvents,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
