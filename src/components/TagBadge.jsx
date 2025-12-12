import { cn } from "@/lib/utils";

export function TagBadge({ tag, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        "bg-secondary text-muted-foreground border border-border",
        className
      )}
    >
      {tag}
    </span>
  );
}

export function TagList({ tags = [], maxVisible = 3, className }) {
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;
  
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visibleTags.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-muted-foreground px-1">
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}
