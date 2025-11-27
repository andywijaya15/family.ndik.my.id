import { supabase } from "@/lib/supabaseClient";

export async function loadProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { user: null, profile: null, error: userError };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile,
    error: profileError,
  };
}
