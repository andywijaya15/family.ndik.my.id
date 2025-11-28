import { supabase } from "@/lib/supabaseClient";

// GET
export const getCategories = async (page: number, perPage: number) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    const { data, count, error } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
        .range(from, to);

    return { data, count, error };
};

// CREATE
export const createCategory = async (name: string, userId: string | null) => {
    const { data, error } = await supabase
        .from("categories")
        .insert([
            {
                name,
                type: "EXPENSE",
                created_by: userId,
                updated_by: userId,
                updated_at: new Date(),
            },
        ])
        .select(); // penting supaya return data

    return { data, error };
};

// UPDATE
export const updateCategory = async (id: string, name: string, userId: string | null) => {
    const { data, error } = await supabase
        .from("categories")
        .update({
            name,
            updated_by: userId,
            updated_at: new Date(),
        })
        .eq("id", id)
        .select();

    return { data, error };
};

// DELETE
export const deleteCategory = async (id: string, userId: string | null) => {
    const { data, error } = await supabase
        .from("categories")
        .update({
            updated_at: new Date(),
            deleted_at: new Date(),
            deleted_by: userId,
        })
        .eq("id", id);

    return { data, error };
};
