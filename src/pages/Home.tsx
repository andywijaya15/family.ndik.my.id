import Layout from "@/components/layouts/Layout";
import { StatsGrid } from "@/components/StatsGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExpenseOverviewByCategory, getOverviewByPaidBy } from "@/repositories/transactionRepository";
import { useEffect, useState } from "react";

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
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const [paidStats, setPaidStats] = useState<{ name: string; total: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; total: number }[]>([]);

  const fetchStats = async () => {
    try {
      // Ambil stats berdasarkan siapa yang bayar
      const paid = await getOverviewByPaidBy(filterMonth, filterYear);
      setPaidStats(paid.data || []);

      // Ambil stats berdasarkan kategori
      const cat = await getExpenseOverviewByCategory(filterMonth, filterYear);
      setCategoryStats(cat.data || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filterMonth, filterYear]); // refresh setiap filter berubah

  return (
    <Layout title="Home">
      <div className="space-y-6">
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
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Overview by Paid By</h2>
          <StatsGrid data={paidStats} subtitle="Total Dibayar Orang Ini" />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Overview by Category</h2>
          <StatsGrid data={categoryStats} subtitle="Total Pengeluaran Bulan Ini" />
        </div>
      </div>
    </Layout>
  );
}
