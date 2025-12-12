import { cn } from '@/lib/utils';

export function ResizableDivider({ onMouseDown, className }) {
  return (
    <div
      className={cn(
        "resizer-handle flex items-center justify-center h-3 border-y border-border bg-secondary/30 transition-colors",
        className
      )}
      onMouseDown={onMouseDown}
    >
      <div className="flex gap-1">
        <div className="w-8 h-0.5 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  );
}
