import { InfoCard } from "./InfoCard";

interface StatsGridProps {
  data: { name: string; total: number }[];
  subtitle: string;
}

export const StatsGrid = ({ data, subtitle }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {data.map((item, idx) => (
        <InfoCard key={idx} title={item.name} value={`Rp ${item.total.toLocaleString("id-ID")}`} subtitle={subtitle} />
      ))}
    </div>
  );
};
