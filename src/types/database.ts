export interface Profile {
  id: string;
  full_name: string;

  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: "EXPENSE" | "INCOME";

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
}

export interface Transaction {
  id: string;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;

  category_id: string | null;
  amount: number;

  transaction_date: string; // format date / timestamp
  description: string | null;

  paid_by: string | null;
  is_reimbursed: boolean;
}