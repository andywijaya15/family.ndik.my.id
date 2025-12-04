import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const InfoCard = ({ title, value, subtitle, className }: InfoCardProps) => {
  return (
    <Card className={`group relative overflow-hidden border-border/50 p-4 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 dark:border-border/30 dark:hover:shadow-primary/10 ${className ?? ""}`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-primary/10" />
      
      <CardHeader className="relative p-0 mb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100 group-hover:scale-110 dark:bg-primary/20">
            <TrendingUp className="size-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-0 space-y-2">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {subtitle && (
          <div className="text-muted-foreground text-xs">{subtitle}</div>
        )}
      </CardContent>

      {/* Bottom accent line */}
      <div className="bg-primary absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full dark:bg-primary/80" />
    </Card>
  );
};
