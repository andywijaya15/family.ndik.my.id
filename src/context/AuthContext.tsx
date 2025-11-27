import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // cek session saat mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // listen login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        createProfileIfNotExists(session.user.id);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
};

async function createProfileIfNotExists(userId: string) {
  // coba cek apakah profile sudah ada
  const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();

  if (existing) return;

  // insert profile baru
  await supabase.from("profiles").insert({
    id: userId,
    full_name: "", // default kosong
  });
}

export const useAuth = () => useContext(AuthContext);
