import { loadProfile } from "@/lib/loadProfile";
import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { user, profile } = await loadProfile();
      setUser(user);
      setProfile(profile);
      setLoading(false);
    };
    fetch();
  }, []);

  return { user, profile, loading };
}
