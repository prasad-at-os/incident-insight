import { cn } from "@/lib/utils";

const stateConfig = {
  open: {
    bg: "bg-state-open/20",
    text: "text-state-open",
    border: "border-state-open/30"
  },
  investigating: {
    bg: "bg-state-investigating/20",
    text: "text-state-investigating",
    border: "border-state-investigating/30"
  },
  resolved: {
    bg: "bg-state-resolved/20",
    text: "text-state-resolved",
    border: "border-state-resolved/30"
  },
  closed: {
    bg: "bg-state-closed/20",
    text: "text-state-closed",
    border: "border-state-closed/30"
  }
};

export function StateBadge({ state, className }) {
  const config = stateConfig[state] || stateConfig.closed;
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  );
}
