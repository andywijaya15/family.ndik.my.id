import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import { Pagination } from "@/components/Pagination";
import { PerPageSelect } from "@/components/PerPageSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
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
  const { setTitle } = useOutletContext<{ setTitle: (v: string) => void }>();

  useEffect(() => {
    setTitle("Transactions");
  }, []);

  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
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
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(totalTransactions / perPage);

  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [filterCategory, setFilterCategory] = useState("ALL");

  const fetchTransactions = async (page = 1, limit = perPage) => {
    const { data, count, error } = await getTransactions(page, limit, filterMonth, filterYear, filterCategory);
    if (error) return console.error(error);
    setTransactions(data || []);
    setTotalTransactions(count || 0);
  };

  const fetchTotalThisMonth = async () => {
    const { data } = await getTransactions(1, 9999, filterMonth, filterYear); // ambil semua bulan ini
    if (!data) return;
    const total = data.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalThisMonth(total);
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
    setPage(1);
    fetchTransactions(1, perPage);
    fetchTotalThisMonth();
  }, [filterMonth, filterYear, filterCategory, perPage]);

  // CREATE / UPDATE
  const save = async () => {
    if (!transactionDate) return toast.error("Transaction date required");
    if (!categoryId) return toast.error("Category required");
    const amountNumber = amount === "" ? 0 : Number(amount);
    if (!amountNumber || amountNumber <= 0) return toast.error("Amount invalid");

    const payload = {
      transaction_date: transactionDate,
      category_id: categoryId,
      amount: amountNumber,
      description,
      paid_by: paidBy,
      updated_by: userId,
      created_by: userId,
      is_reimbursed: false,
    };

    if (!selected) {
      const { error } = await createTransaction(payload);
      if (error) return toast.error(error.message);
      toast.success("Created!");
    } else {
      const { error } = await updateTransaction(selected.id, payload);
      if (error) return toast.error(error.message);
      toast.success("Updated!");
    }

    await fetchTransactions(1, perPage);
    await fetchTotalThisMonth(); // tambahan
    setOpenForm(false);
    resetForm();
  };

  const resetForm = () => {
    setSelected(null);
    setTransactionDate(new Date().toISOString().split("T")[0]);
    setCategoryId(null);
    setAmount("");
    setDescription("");
    setPaidBy(null);
  };

  const remove = async () => {
    if (!selected) return;
    const { error } = await deleteTransaction(selected.id, userId);
    if (error) return toast.error(error.message);

    toast.success("Deleted!");
    await fetchTransactions(1, perPage);
    await fetchTotalThisMonth(); // tambahan
    resetForm();
    setOpenDelete(false);
  };

  // useMemo untuk options agar tidak recreate setiap render
  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => (
        <SelectItem key={cat.id} value={cat.id}>
          {cat.name}
        </SelectItem>
      )),
    [categories]
  );

  const profileOptions = useMemo(
    () => (
      <>
        <SelectItem value="__SHARED__">EXPENSE</SelectItem>
        {profiles.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.full_name}
          </SelectItem>
        ))}
      </>
    ),
    [profiles]
  );

  const profileMap = useMemo(() => {
    const map: Record<string, string> = {};
    profiles.forEach((p) => {
      map[p.id] = p.full_name;
    });
    return map;
  }, [profiles]);

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        <Button
          onClick={() => {
            resetForm();
            setOpenForm(true);
          }}
          className="w-full sm:w-auto"
        >
          + Add Transaction
        </Button>

        <PerPageSelect
          perPage={perPage}
          onChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
            fetchTransactions(1, newPerPage);
          }}
        />
      </div>

      <div className="flex gap-2 mb-4">
        {/* Filter Bulan */}
        <Select value={filterMonth.toString()} onValueChange={(val) => setFilterMonth(Number(val))}>
          <SelectTrigger className="border p-2 rounded w-32">
            <SelectValue>{months[filterMonth - 1]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((m, idx) => (
              <SelectItem key={idx} value={(idx + 1).toString()}>
                {m}
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

        <Select value={filterCategory ?? ""} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { accessorKey: "transaction_date", header: "Date" },
          {
            accessorKey: "category_id",
            header: "Category",
            cell: ({ row }) => {
              const id = row.original.category_id;
              const name = id ? categoryMap[id] : null;

              return (
                <div>
                  {name ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{name}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </div>
              );
            },
          },
          {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
              const amount = row.original.amount || 0;
              return <div className="font-medium">Rp {amount.toLocaleString("id-ID")}</div>;
            },
          },
          {
            accessorKey: "paid_by",
            header: "Paid By",
            cell: ({ row }) => {
              const id = row.original.paid_by;
              const name = id ? profileMap[id] : null;

              return (
                <div>
                  {id === null ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">EXPENSE</span>
                  ) : name ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{name}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </div>
              );
            },
          },

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
                    setAmount(String(t.amount));
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

      <Card className="mt-4 text-right">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600 font-normal">Total Pengeluaran Bulan Ini</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">Rp {totalThisMonth.toLocaleString("id-ID")}</div>
        </CardContent>
      </Card>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => {
          const newPage = page - 1;
          setPage(newPage);
          fetchTransactions(newPage, perPage);
        }}
        onNext={() => {
          const newPage = page + 1;
          setPage(newPage);
          fetchTransactions(newPage, perPage);
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
            <Select value={categoryId ?? ""} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>{categoryOptions}</SelectContent>
            </Select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block mb-2 text-sm">Amount</label>
            <Input
              type="text"
              value={amount}
              onChange={(e) => {
                const v = e.target.value;

                // hanya angka
                if (/^\d*$/.test(v)) {
                  setAmount(v);
                }
              }}
              placeholder="Masukkan jumlah"
            />
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
            <Select
              value={paidBy ?? "__SHARED__"}
              onValueChange={(val) => {
                if (val === "__SHARED__") setPaidBy(null);
                else setPaidBy(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>{profileOptions}</SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        itemName={selected?.description ?? undefined}
        onDelete={remove}
      />
    </>
  );
};
