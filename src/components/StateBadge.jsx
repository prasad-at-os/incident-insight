import { cn } from "@/lib/utils";

const stateConfig = {
  open: {
    bg: "bg-state-open/20",
    text: "text-state-open",
    border: "border-state-open/30",
    label: "Open"
  },
  closed: {
    bg: "bg-state-closed/20",
    text: "text-state-closed",
    border: "border-state-closed/30",
    label: "Closed"
  },
  "in progress": {
    bg: "bg-state-investigating/20",
    text: "text-state-investigating",
    border: "border-state-investigating/30",
    label: "In Progress"
  }
};

export function StateBadge({ state, className }) {
  const config = stateConfig[state] || stateConfig.open;

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
      {config.label}
    </span>
  );
}
