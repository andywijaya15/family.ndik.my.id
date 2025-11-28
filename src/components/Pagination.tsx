import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ page, totalPages, onPrev, onNext }: any) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Prev */}
      <Button variant="outline" size="icon" onClick={onPrev} disabled={page === 1} className="rounded-full">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page info */}
      <span className="text-sm font-medium text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>

      {/* Next */}
      <Button variant="outline" size="icon" onClick={onNext} disabled={page === totalPages} className="rounded-full">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
