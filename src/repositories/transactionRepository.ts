import { supabase } from "@/lib/supabaseClient";
import type { Transaction } from "@/types/database";

// GET
export const getTransactions = async (page: number, perPage: number, month?: number, year?: number) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    let query = supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("transaction_date", { ascending: false })
        .range(from, to);

    if (month && year) {
        query = query
            .gte("transaction_date", `${year}-${month.toString().padStart(2, "0")}-01`)
            .lte(
                "transaction_date",
                `${year}-${month.toString().padStart(2, "0")}-${new Date(year, month, 0).getDate()}`
            );
    }

    const { data, count, error } = await query;
    return { data: data as Transaction[] | null, count, error };
};

// CREATE
export const createTransaction = async (payload: Partial<Transaction>) => {
    const body = {
        ...payload,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("transactions")
        .insert(body)
        .select();

    return { data: data as Transaction[] | null, error };
};

// UPDATE
export const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
    const body = {
        ...payload,
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("transactions")
        .update(body)
        .eq("id", id)
        .select();

    return { data: data as Transaction[] | null, error };
};

// DELETE
export const deleteTransaction = async (id: string, userId: string | null) => {
    const body = {
        deleted_at: new Date(),
        deleted_by: userId,
        updated_at: new Date(),
    };

    const { data, error } = await supabase
        .from("transactions")
        .update(body)
        .eq("id", id);

    return { data: data as Transaction[] | null, error };
};
