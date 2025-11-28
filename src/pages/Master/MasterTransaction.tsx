import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import Layout from "@/components/layouts/Layout";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getCategories } from "@/repositories/categoryRepository";
import { getProfiles } from "@/repositories/profileRepository";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/repositories/transactionRepository";
import type { Category, Profile, Transaction } from "@/types/database";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MasterTransaction = () => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const [transactionDate, setTransactionDate] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(totalTransactions / perPage);

  const fetchTransactions = async (page = 1) => {
    const { data, count, error } = await getTransactions(page, perPage, filterMonth, filterYear);
    if (error) return console.error(error);
    setTransactions(data || []);
    setTotalTransactions(count || 0);
  };

  const fetchSupportingData = async () => {
    const cat = await getCategories();
    const prof = await getProfiles();
    setCategories(cat.data || []);
    setProfiles(prof.data || []);
  };

  useEffect(() => {
    fetchTransactions();
    fetchSupportingData();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [filterMonth, filterYear]);

  // CREATE / UPDATE
  const save = async () => {
    if (!transactionDate) return toast.error("Transaction date required");
    if (!categoryId) return toast.error("Category required");
    if (!amount || amount <= 0) return toast.error("Amount invalid");

    if (!selected) {
      // CREATE
      const { error } = await createTransaction({
        transaction_date: transactionDate,
        category_id: categoryId,
        amount,
        description,
        paid_by: paidBy,
        created_by: userId,
        updated_by: userId,
        is_reimbursed: false,
      });

      if (error) return toast.error(error.message);
      toast.success("Created!");
    } else {
      // UPDATE
      const { error } = await updateTransaction(selected.id, {
        transaction_date: transactionDate,
        category_id: categoryId,
        amount,
        description,
        paid_by: paidBy,
        updated_by: userId,
      });

      if (error) return toast.error(error.message);
      toast.success("Updated!");
    }

    await fetchTransactions(1);
    setOpenForm(false);
    resetForm();
  };

  const resetForm = () => {
    setSelected(null);
    setTransactionDate("");
    setCategoryId(null);
    setAmount(0);
    setDescription("");
    setPaidBy(null);
  };

  const remove = async () => {
    if (!selected) return;

    const { error } = await deleteTransaction(selected.id, userId);
    if (error) return toast.error(error.message);

    toast.success("Deleted!");
    await fetchTransactions(1);
    resetForm();
    setOpenDelete(false);
  };

  return (
    <Layout title="Transactions">
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => {
            resetForm();
            setOpenForm(true);
          }}
        >
          + Add Transaction
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        {/* Filter Bulan */}
        <Select value={filterMonth.toString()} onValueChange={(val) => setFilterMonth(Number(val))}>
          <SelectTrigger className="border p-2 rounded w-32">
            <SelectValue>
              {months[filterMonth - 1]} {/* Tampilkan nama bulan */}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((name, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Tahun */}
        <Select value={filterYear.toString()} onValueChange={(val) => setFilterYear(Number(val))}>
          <SelectTrigger className="border p-2 rounded w-24">
            <SelectValue>{filterYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { accessorKey: "transaction_date", header: "Date" },
          { accessorKey: "amount", header: "Amount" },
          { accessorKey: "description", header: "Description" },
          {
            id: "actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const t = row.original;

                    setSelected(t);
                    setTransactionDate(t.transaction_date);
                    setCategoryId(t.category_id);
                    setAmount(t.amount);
                    setDescription(t.description || "");
                    setPaidBy(t.paid_by);

                    setOpenForm(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelected(row.original);
                    setOpenDelete(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={transactions}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => {
          setPage(page - 1);
          fetchTransactions(page - 1);
        }}
        onNext={() => {
          setPage(page + 1);
          fetchTransactions(page + 1);
        }}
      />

      {/* FORM */}
      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selected ? "Update Transaction" : "Add Transaction"}
        onSubmit={save}
      >
        <div className="space-y-4">
          {/* DATE */}
          <div>
            <label className="block mb-2 text-sm">Transaction Date</label>
            <Input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 text-sm">Category</label>
            <select
              className="border p-2 w-full rounded"
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block mb-2 text-sm">Amount</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 text-sm">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          {/* PAID BY */}
          <div>
            <label className="block mb-2 text-sm">Paid By</label>
            <select
              className="border p-2 w-full rounded"
              value={paidBy ?? ""}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="">Select person</option>
              {profiles.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        itemName={selected?.description ?? undefined}
        onDelete={remove}
      />
    </Layout>
  );
};
