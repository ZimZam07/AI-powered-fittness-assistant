import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  activity_level: string;
  workout_level: string;
  workout_place: string;
}

export interface CreateAccountData {
  username: string;
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  workout_level: string;
  activity_level: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<string | null>;
  createAccount: (data: CreateAccountData) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return (data as Profile) || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setTimeout(() => fetchProfile(newSession.user.id).then(setProfile), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user.id).then(setProfile).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (identifier: string, password: string): Promise<string | null> => {
    let email = identifier.trim();
    if (!email.includes("@")) {
      const { data, error } = await supabase.rpc("email_for_username", { _username: email });
      if (error || !data) return "No account found with that username.";
      email = data as string;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed")) return "Please verify your email before logging in.";
      if (msg.includes("invalid")) return "Incorrect username/email or password.";
      return error.message;
    }
    return null;
  };

  const createAccount = async (data: CreateAccountData): Promise<string | null> => {
    // Check username uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .maybeSingle();
    if (existing) return "Username already taken.";

    const redirectUrl = `${window.location.origin}/`;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return "Email already in use.";
      }
      return error.message;
    }

    const userId = signUpData.user?.id;
    if (!userId) return "Signup failed. Please try again.";

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username: data.username.trim(),
      name: data.name.trim(),
      age: data.age,
      gender: data.gender,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      goal: data.goal,
      workout_level: data.workout_level,
      activity_level: data.activity_level,
      workout_place: data.workout_level === "advanced" ? "gym" : "home",
    });

    if (profileError) {
      if (profileError.message.toLowerCase().includes("duplicate") || profileError.code === "23505") {
        return "Username already taken.";
      }
      return profileError.message;
    }

    // If session was created (auto-confirm on), sign out so user verifies first
    if (signUpData.session) await supabase.auth.signOut();
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user) setProfile(await fetchProfile(session.user.id));
  };

  const resetPassword = async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    return error ? error.message : null;
  };

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, profile, loading,
      signOut, refreshProfile, login, createAccount, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
