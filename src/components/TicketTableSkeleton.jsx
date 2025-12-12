export function TicketTableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="w-24 h-5 skeleton-shimmer rounded" />
          <div className="flex-1 h-5 skeleton-shimmer rounded max-w-md" />
          <div className="w-20 h-6 skeleton-shimmer rounded-full" />
          <div className="w-24 h-6 skeleton-shimmer rounded-full" />
          <div className="w-32 h-5 skeleton-shimmer rounded" />
          <div className="w-24 h-5 skeleton-shimmer rounded" />
          <div className="flex gap-1">
            <div className="w-12 h-5 skeleton-shimmer rounded" />
            <div className="w-12 h-5 skeleton-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
