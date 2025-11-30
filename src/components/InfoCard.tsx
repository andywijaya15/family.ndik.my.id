import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const InfoCard = ({ title, value, subtitle, className }: InfoCardProps) => {
  return (
    <Card className={`p-4 rounded-xl shadow-md ${className ?? ""}`}>
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-sm text-gray-600 font-normal">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
      </CardContent>
    </Card>
  );
};
