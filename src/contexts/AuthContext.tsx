import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  activity_level: string;
  workout_level: string;
  workout_place: string;
  profile_complete: boolean;
}

interface AuthContextType {
  session: { userId: string } | null;
  user: { id: string } | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
  refreshProfile: () => void;
  login: (userId: string, password: string) => string | null;
  createAccount: (data: CreateAccountData) => string | null;
}

export interface CreateAccountData {
  name: string;
  userId: string;
  password: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  workout_level: string;
  activity_level: string;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: () => {},
  refreshProfile: () => {},
  login: () => null,
  createAccount: () => null,
});

export const useAuth = () => useContext(AuthContext);

function getUsers(): Record<string, { password: string; profile: Profile }> {
  const raw = localStorage.getItem("fitness_users");
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, { password: string; profile: Profile }>) {
  localStorage.setItem("fitness_users", JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ userId: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("fitness_current_user");
    if (currentUser) {
      const users = getUsers();
      const userData = users[currentUser];
      if (userData) {
        setSession({ userId: currentUser });
        setProfile(userData.profile);
      }
    }
    setLoading(false);
  }, []);

  const login = (userId: string, password: string): string | null => {
    const users = getUsers();
    const userData = users[userId];
    if (!userData || userData.password !== password) {
      return "Invalid user ID or password";
    }
    localStorage.setItem("fitness_current_user", userId);
    setSession({ userId });
    setProfile(userData.profile);
    return null;
  };

  const createAccount = (data: CreateAccountData): string | null => {
    const users = getUsers();
    if (users[data.userId]) {
      return "User ID already exists. Please choose a different one.";
    }
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      userId: data.userId,
      name: data.name,
      age: data.age,
      gender: data.gender,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      goal: data.goal,
      activity_level: data.activity_level,
      workout_level: data.workout_level,
      workout_place: data.workout_level === "advanced" ? "gym" : "home",
      profile_complete: true,
    };
    users[data.userId] = { password: data.password, profile: newProfile };
    saveUsers(users);
    return null;
  };

  const signOut = () => {
    localStorage.removeItem("fitness_current_user");
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = () => {
    if (session) {
      const users = getUsers();
      const userData = users[session.userId];
      if (userData) setProfile(userData.profile);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user: session ? { id: session.userId } : null,
      profile,
      loading,
      signOut,
      refreshProfile,
      login,
      createAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
