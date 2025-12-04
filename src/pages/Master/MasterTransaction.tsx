import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import { Pagination } from "@/components/Pagination";
import { PerPageSelect } from "@/components/PerPageSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar, CircleDollarSign, DollarSign, Edit2, FileText, Filter, Plus, Receipt, Trash2, TrendingDown, User } from "lucide-react";
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
      toast.success("Transaction created successfully!");
    } else {
      const { error } = await updateTransaction(selected.id, payload);
      if (error) return toast.error(error.message);
      toast.success("Transaction updated successfully!");
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

    toast.success("Transaction deleted successfully!");
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
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl dark:bg-primary/20">
            <CircleDollarSign className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Transactions</h2>
            <p className="text-muted-foreground text-sm">Track and manage your expenses</p>
          </div>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setOpenForm(true);
          }}
          className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          size="lg"
        >
          <Plus className="mr-2 size-4" />
          Add Transaction
        </Button>
      </div>

      {/* Stats & Filters Card */}
      <Card className="border-border/50 dark:border-border/30">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Total This Month */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-xl dark:bg-destructive/20 dark:text-red-400 md:size-14">
                  <TrendingDown className="size-6 md:size-7" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium md:text-sm">Total Expenses This Period</p>
                  <p className="text-2xl font-bold md:text-3xl">Rp {totalThisMonth.toLocaleString("id-ID")}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <PerPageSelect
                  perPage={perPage}
                  onChange={(newPerPage) => {
                    setPerPage(newPerPage);
                    setPage(1);
                    fetchTransactions(1, newPerPage);
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="border-t pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="text-muted-foreground size-4" />
                <span className="text-sm font-medium">Filters</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground size-4" />
                  <div className="flex flex-1 gap-2 sm:flex-initial">
                    <Select value={filterMonth.toString()} onValueChange={(val) => setFilterMonth(Number(val))}>
                      <SelectTrigger className="flex-1 sm:w-36">
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

                    <Select value={filterYear.toString()} onValueChange={(val) => setFilterYear(Number(val))}>
                      <SelectTrigger className="w-24 sm:w-28">
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
                </div>

                <Select value={filterCategory ?? ""} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
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

              {/* Mobile PerPage */}
              <div className="mt-3 sm:hidden">
                <PerPageSelect
                  perPage={perPage}
                  onChange={(newPerPage) => {
                    setPerPage(newPerPage);
                    setPage(1);
                    fetchTransactions(1, newPerPage);
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="border-border/50 hidden md:block">
        <CardContent className="p-6">
          <DataTable
            columns={[
              {
                accessorKey: "transaction_date",
                header: "Date",
                cell: ({ row }) => (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="font-medium">{row.original.transaction_date}</span>
                  </div>
                ),
              },
              {
                accessorKey: "category_id",
                header: "Category",
                cell: ({ row }) => {
                  const id = row.original.category_id;
                  const name = id ? categoryMap[id] : null;

                  return (
                    <div>
                      {name ? (
                        <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-primary/20 dark:text-primary">
                          <Receipt className="size-3" />
                          {name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
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
                  return (
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-destructive size-4" />
                      <span className="font-bold">Rp {amount.toLocaleString("id-ID")}</span>
                    </div>
                  );
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
                        <span className="bg-secondary/10 text-secondary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-secondary/20">
                          <User className="size-3" />
                          SHARED
                        </span>
                      ) : name ? (
                        <span className="bg-blue-500/10 text-blue-700 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-blue-500/20 dark:text-blue-400">
                          <User className="size-3" />
                          {name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                  );
                },
              },
              {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => (
                  <span className="text-muted-foreground text-sm">
                    {row.original.description || "-"}
                  </span>
                ),
              },
              {
                id: "actions",
                header: "Actions",
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
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Edit2 className="mr-1 size-3" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelected(row.original);
                        setOpenDelete(true);
                      }}
                      className="hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="mr-1 size-3" />
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={transactions}
          />
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {transactions.length === 0 ? (
          <Card className="border-border/50 dark:border-border/30">
            <CardContent className="p-8 text-center">
              <CircleDollarSign className="text-muted-foreground mx-auto mb-3 size-12" />
              <p className="text-muted-foreground text-sm">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => {
            const categoryName = transaction.category_id ? categoryMap[transaction.category_id] : null;
            const paidByName = transaction.paid_by ? profileMap[transaction.paid_by] : null;

            return (
              <Card key={transaction.id} className="border-border/50 overflow-hidden dark:border-border/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header: Date & Amount */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground size-4" />
                        <span className="text-sm font-medium">{transaction.transaction_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="text-destructive size-4 dark:text-red-400" />
                        <span className="text-lg font-bold">Rp {transaction.amount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    {/* Category & Paid By */}
                    <div className="flex flex-wrap gap-2">
                      {categoryName && (
                        <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-primary/20">
                          <Receipt className="size-3" />
                          {categoryName}
                        </span>
                      )}
                      {transaction.paid_by === null ? (
                        <span className="bg-secondary/10 text-secondary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-secondary/20">
                          <User className="size-3" />
                          SHARED
                        </span>
                      ) : paidByName ? (
                        <span className="bg-blue-500/10 text-blue-700 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium dark:bg-blue-500/20 dark:text-blue-400">
                          <User className="size-3" />
                          {paidByName}
                        </span>
                      ) : null}
                    </div>

                    {/* Description */}
                    {transaction.description && (
                      <p className="text-muted-foreground text-sm">{transaction.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelected(transaction);
                          setTransactionDate(transaction.transaction_date);
                          setCategoryId(transaction.category_id);
                          setAmount(String(transaction.amount));
                          setDescription(transaction.description || "");
                          setPaidBy(transaction.paid_by);
                          setOpenForm(true);
                        }}
                        className="hover:bg-primary/10 hover:text-primary flex-1 transition-colors dark:hover:bg-primary/20"
                      >
                        <Edit2 className="mr-1 size-3" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(transaction);
                          setOpenDelete(true);
                        }}
                        className="hover:bg-destructive/90 flex-1 transition-colors"
                      >
                        <Trash2 className="mr-1 size-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
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

      {/* Form Dialog */}
      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selected ? "Update Transaction" : "Add New Transaction"}
        onSubmit={save}
        submitLabel={selected ? "Update Transaction" : "Create Transaction"}
      >
        <div className="space-y-4">
          {/* DATE */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="size-4" />
              Transaction Date
            </Label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Receipt className="size-4" />
              Category
            </Label>
            <Select value={categoryId ?? ""} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>{categoryOptions}</SelectContent>
            </Select>
          </div>

          {/* AMOUNT */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="size-4" />
              Amount
            </Label>
            <div className="relative">
              <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">Rp</span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d*$/.test(v)) {
                    setAmount(v);
                  }
                }}
                placeholder="0"
                className="pl-10"
              />
            </div>
            <p className="text-muted-foreground text-xs">Enter amount in Rupiah (numbers only)</p>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="size-4" />
              Description
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping, Fuel"
            />
          </div>

          {/* PAID BY */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="size-4" />
              Paid By
            </Label>
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
            <p className="text-muted-foreground text-xs">Select who paid for this expense</p>
          </div>
        </div>
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        itemName={selected?.description ?? undefined}
        onDelete={remove}
      />
    </div>
  );
};
