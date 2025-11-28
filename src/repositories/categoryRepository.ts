import { supabase } from "@/lib/supabaseClient";

export const getCategories = async (page: number, perPage: number) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    return await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .range(from, to);
}

export const createCategory = async (name: string, userId: string | null) => {
    const { data, error } = await supabase.from("categories").insert([
        {
            name,
            type: "EXPENSE",
            created_by: userId,
            updated_by: userId,
            updated_at: new Date(),
        },
    ]);

    if (error) {
        console.error("Supabase Error:", error);
    }

    return { data, error };
}

export const updateCategory = async (id: string, name: string, userId: string | null) => {
    return await supabase
        .from("categories")
        .update({
            name,
            updated_by: userId,
            updated_at: new Date(),
        })
        .eq("id", id);
}

export const deleteCategory = async (id: string) => {
    return await supabase.from("categories").delete().eq("id", id);
}
