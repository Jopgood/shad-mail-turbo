import { cn } from "@shad-mail/ui";

function SkeletonItem() {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600/50"></div>
          </div>
          <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="h-3 w-48 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="h-8 w-full animate-pulse rounded bg-muted"></div>

      <div className="flex items-center gap-2">
        <div className="h-5 w-12 animate-pulse rounded-full bg-muted"></div>
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted"></div>
      </div>
    </div>
  );
}

export default function MailItemSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </>
  );
}
