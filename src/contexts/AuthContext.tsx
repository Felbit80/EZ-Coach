import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { User, SubscriptionPlan } from "../types";
import { Session } from "@supabase/supabase-js";

interface AuthContextData {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (plan: SubscriptionPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("🔄 Carregando perfil do usuário:", userId);

      const { data, error } = await supabase
        .from("users") // ✅ CORRETO: sua tabela se chama 'users'
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Erro ao carregar perfil:", error);

        // Se o perfil não existe, cria um novo
        if (error.code === "PGRST116") {
          await createUserProfile(userId);
          return;
        }
        throw error;
      }

      console.log("✅ Perfil carregado:", data);
      setUser(data);
    } catch (error) {
      console.error("❌ Erro crítico ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      console.log("🔄 Criando novo perfil para:", userId);

      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // Pequeno delay para garantir que o usuário do auth está disponível
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: authUser.user?.email || "",
          name: authUser.user?.email?.split("@")[0] || "Usuário",
          subscription_plan: "free",
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao criar perfil:", error);

        // Tenta novamente após 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const { data: retryData, error: retryError } = await supabase
          .from("users")
          .insert({
            id: userId,
            email: authUser.user?.email || "",
            name: authUser.user?.email?.split("@")[0] || "Usuário",
            subscription_plan: "free",
          })
          .select()
          .single();

        if (retryError) {
          console.error("❌ Erro na segunda tentativa:", retryError);
          throw retryError;
        }

        console.log("✅ Novo perfil criado na segunda tentativa:", retryData);
        setUser(retryData);
        return;
      }

      console.log("✅ Novo perfil criado:", data);
      setUser(data);
    } catch (error) {
      console.error("❌ Erro crítico ao criar perfil:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Erro no login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // 1. Cria usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Se usuário foi criado, cria perfil na tabela users
      if (authData.user) {
        console.log("🔄 Criando perfil para novo usuário:", authData.user.id);

        const { error: profileError } = await supabase
          .from("users") // ✅ CORRETO: sua tabela se chama 'users'
          .insert({
            id: authData.user.id,
            email: email,
            name: name, // ✅ CORRETO: campo 'name'
            subscription_plan: "free",
          });

        if (profileError) {
          console.error("❌ Erro ao criar perfil:", profileError);
          // Se falhar ao criar perfil, deleta o usuário do auth
          await supabase.auth.signOut();
          throw new Error("Erro ao criar perfil do usuário");
        }

        console.log("✅ Usuário e perfil criados com sucesso");
      }
    } catch (error: any) {
      console.error("❌ Erro no cadastro:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Erro no logout:", error);
      throw error;
    }
  };

  const updateSubscription = async (plan: SubscriptionPlan) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users") // ✅ CORRETO: sua tabela se chama 'users'
        .update({ subscription_plan: plan })
        .eq("id", user.id);

      if (error) throw error;
      setUser({ ...user, subscription_plan: plan });
    } catch (error: any) {
      console.error("❌ Erro ao atualizar assinatura:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
