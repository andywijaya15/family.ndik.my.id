import { LoadingCards } from "@/components/LoadingState";
import { StatsGrid } from "@/components/StatsGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getExpenseOverviewByCategory, getOverviewByPaidBy } from "@/repositories/transactionRepository";
import { Calendar, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

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

export default function Home() {
  const { setTitle } = useOutletContext<{ setTitle: (v: string) => void }>();

  useEffect(() => {
    setTitle("Home");
  }, []);

  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const [paidStats, setPaidStats] = useState<{ name: string; total: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const paid = await getOverviewByPaidBy(filterMonth, filterYear);
      setPaidStats(paid.data || []);

      const cat = await getExpenseOverviewByCategory(filterMonth, filterYear);
      setCategoryStats(cat.data || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filterMonth, filterYear]);

  // Calculate totals
  const totalExpenses = categoryStats.reduce((sum, item) => sum + item.total, 0);
  const totalPaid = paidStats.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/95 to-primary/90 p-6 shadow-xl dark:from-green-800 dark:via-blue-900 dark:to-slate-900 md:p-8">
        <div className="absolute right-0 top-0 size-64 rounded-full bg-white/10 blur-3xl dark:bg-green-500/20" />
        <div className="absolute bottom-0 left-0 size-48 rounded-full bg-white/10 blur-3xl dark:bg-green-400/20" />
        
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm dark:bg-white/15 md:size-12">
              <Wallet className="size-5 text-white md:size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white md:text-2xl">Financial Overview</h1>
              <p className="text-xs text-white/90 md:text-sm">Track your family expenses</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm dark:bg-white/10">
              <Calendar className="size-4 text-white" />
              <span className="text-sm font-medium text-white">Period:</span>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterMonth.toString()} onValueChange={(val) => setFilterMonth(Number(val))}>
                <SelectTrigger className="flex-1 border-white/20 bg-white/10 text-white backdrop-blur-sm dark:border-white/20 dark:bg-white/10 sm:w-36">
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
                <SelectTrigger className="w-24 border-white/20 bg-white/10 text-white backdrop-blur-sm dark:border-white/20 dark:bg-white/10 sm:w-28">
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
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <LoadingCards count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group overflow-hidden border-border/50 transition-all hover:shadow-lg dark:border-border/30 dark:hover:shadow-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold">Rp {totalExpenses.toLocaleString("id-ID")}</p>
                <p className="text-muted-foreground text-xs">This period</p>
              </div>
              <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 dark:bg-destructive/20 dark:text-red-400">
                <TrendingDown className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-border/50 transition-all hover:shadow-lg dark:border-border/30 dark:hover:shadow-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">Total Paid</p>
                <p className="text-3xl font-bold">Rp {totalPaid.toLocaleString("id-ID")}</p>
                <p className="text-muted-foreground text-xs">All members</p>
              </div>
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 dark:bg-primary/20">
                <TrendingUp className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-border/50 transition-all hover:shadow-lg dark:border-border/30 dark:hover:shadow-secondary/10 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold">{categoryStats.length}</p>
                <p className="text-muted-foreground text-xs">Active categories</p>
              </div>
              <div className="bg-secondary/10 text-secondary-foreground flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 dark:bg-secondary/20">
                <Wallet className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Paid By Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg dark:bg-primary/20">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Expenses by Member</h2>
            <p className="text-muted-foreground text-sm">Who paid what this period</p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50 dark:border-border/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <StatsGrid data={paidStats} subtitle="Total paid by this member" />
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 text-secondary-foreground flex size-10 items-center justify-center rounded-lg dark:bg-secondary/20">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Expenses by Category</h2>
            <p className="text-muted-foreground text-sm">Breakdown of spending categories</p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50 dark:border-border/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <StatsGrid data={categoryStats} subtitle="Total expenses this period" />
        )}
      </div>
    </div>
  );
}
