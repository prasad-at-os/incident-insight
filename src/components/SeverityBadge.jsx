import { cn } from "@/lib/utils";

const severityConfig = {
  critical: {
    bg: "bg-severity-critical/20",
    text: "text-severity-critical",
    border: "border-severity-critical/30",
    dot: "bg-severity-critical",
    pulse: true
  },
  high: {
    bg: "bg-severity-high/20",
    text: "text-severity-high",
    border: "border-severity-high/30",
    dot: "bg-severity-high",
    pulse: false
  },
  medium: {
    bg: "bg-severity-medium/20",
    text: "text-severity-medium",
    border: "border-severity-medium/30",
    dot: "bg-severity-medium",
    pulse: false
  },
  low: {
    bg: "bg-severity-low/20",
    text: "text-severity-low",
    border: "border-severity-low/30",
    dot: "bg-severity-low",
    pulse: false
  }
};

export function SeverityBadge({ severity, className }) {
  const config = severityConfig[severity] || severityConfig.low;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        config.pulse && "pulse-critical",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}
