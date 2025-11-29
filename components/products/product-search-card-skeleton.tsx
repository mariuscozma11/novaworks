import { Skeleton } from '@/components/ui/skeleton';

export function ProductSearchCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      {/* Image skeleton */}
      <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
