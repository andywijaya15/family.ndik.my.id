import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/database";

// GET
export const getCategories = async (page: number = 1, perPage: number = 1000) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    const { data, count, error } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
        .range(from, to);

    return { data: data as Category[] | null, count, error };
};

// CREATE
export const createCategory = async (payload: Partial<Category>) => {
    const body = {
        ...payload,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("categories")
        .insert(body)
        .select();

    return { data: data as Category[] | null, error };
};

// UPDATE
export const updateCategory = async (id: string, payload: Partial<Category>) => {
    const body = {
        ...payload,
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("categories")
        .update(body)
        .eq("id", id)
        .select();

    return { data: data as Category[] | null, error };
};

// DELETE
export const deleteCategory = async (id: string, userId: string | null) => {
    const body = {
        deleted_at: new Date(),
        deleted_by: userId,
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("categories")
        .update(body)
        .eq("id", id);

    return { data: data as Category[] | null, error };
};
