import { supabase } from "@/lib/supabaseClient";
import type { Transaction } from "@/types/database";
import { uppercaseData } from "@/utils/uppercase";

// GET
export const getTransactions = async (page: number, perPage: number, month?: number, year?: number, categoryId?: string) => {
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;

    let query = supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("transaction_date", { ascending: true })
        .range(from, to);

    if (month && year) {
        query = query
            .gte("transaction_date", `${year}-${month.toString().padStart(2, "0")}-01`)
            .lte(
                "transaction_date",
                `${year}-${month.toString().padStart(2, "0")}-${new Date(year, month, 0).getDate()}`
            );
    }

    if (categoryId && categoryId !== "ALL") {
    query = query.eq("category_id", categoryId);
  }

    const { data, count, error } = await query;
    return { data: data as Transaction[] | null, count, error };
};

// CREATE
export const createTransaction = async (payload: Partial<Transaction>) => {
    const body = uppercaseData({
        ...payload,
        created_at: new Date(),
        updated_at: new Date(),
    });



    const { data, error } = await supabase
        .from("transactions")
        .insert(body)
        .select();

    return { data: data as Transaction[] | null, error };
};

// UPDATE
export const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
    const body = uppercaseData({
        ...payload,
        updated_at: new Date(),
    });

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

// OVERVIEW BY CATEGORY
export const getExpenseOverviewByCategory = async (month: number, year: number) => {
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;

    const { data, error } = await supabase
        .from("transactions")
        .select(`
            category_id,
            amount,
            categories (
                id,
                name
            )
        `)
        .is("deleted_at", null)
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);

    if (error) return { data: null, error };

    // ----- GROUPING -----
    const grouped: Record<string, { name: string; total: number }> = {};

    data.forEach((tx) => {
        if (!tx.category_id) return;

        const id = tx.category_id;
        const category = Array.isArray(tx.categories) ? tx.categories[0] : tx.categories;
        const name = category?.name ?? "Unknown";

        if (!grouped[id]) {
            grouped[id] = { name, total: 0 };
        }

        grouped[id].total += tx.amount;
    });

    return {
        data: Object.values(grouped).sort((a, b) => b.total - a.total),
        error: null,
    };
};

export const getOverviewByPaidBy = async (month: number, year: number) => {
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;

    const { data, error } = await supabase
        .from("transactions")
        .select(`
            amount,
            paid_by,
            profiles:paid_by ( full_name )
        `)
        .is("deleted_at", null)
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);

    if (error) return { data: null, error };

    // --- GROUPING IDENTIK DENGAN KODE KAMU ---
    const grouped: Record<string, { name: string; total: number }> = {};

    data.forEach((tx) => {
        if (!tx.paid_by) return;

        const id = tx.paid_by;

        // can be object OR array
        const profile = Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles;
        const name = profile?.full_name ?? "Unknown";

        if (!grouped[id]) {
            grouped[id] = { name, total: 0 };
        }

        grouped[id].total += tx.amount;
    });

    return {
        data: Object.values(grouped).sort((a, b) => b.total - a.total),
        error: null,
    };
};
