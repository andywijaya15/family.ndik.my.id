import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const LoadingCards = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50 dark:border-border/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="size-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const LoadingTable = () => {
  return (
    <Card className="border-border/50 dark:border-border/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full max-w-[200px]" />
                <Skeleton className="h-3 w-full max-w-[150px]" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingMobileCards = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50 dark:border-border/30">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const LoadingStats = () => {
  return (
    <Card className="border-border/50 dark:border-border/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export const LoadingHero = () => {
  return (
    <Card className="border-border/50 dark:border-border/30">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl md:size-12" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 md:h-7" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
