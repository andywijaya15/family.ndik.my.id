import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/database";

// GET
export const getProfiles = async (page: number = 1, perPage: number = 1000) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    const { data, count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .range(from, to);

    return { data: data as Profile[] | null, count, error };
};
