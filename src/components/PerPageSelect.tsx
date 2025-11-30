import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerPageSelectProps {
  perPage: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export function PerPageSelect({ perPage, onChange, options = [5, 10, 20, 50, 100], className }: PerPageSelectProps) {
  return (
    <div className={className ?? "w-full sm:w-40"}>
      <Select value={String(perPage)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger>
          <SelectValue placeholder="Rows per page" />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt} rows
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
