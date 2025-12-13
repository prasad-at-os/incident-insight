import { cn } from "@/lib/utils";

const severityConfig = {
  sev1: {
    bg: "bg-severity-critical/20",
    text: "text-severity-critical",
    border: "border-severity-critical/30",
    dot: "bg-severity-critical",
    pulse: true,
    label: "Sev1"
  },
  sev2: {
    bg: "bg-severity-high/20",
    text: "text-severity-high",
    border: "border-severity-high/30",
    dot: "bg-severity-high",
    pulse: false,
    label: "Sev2"
  },
  sev3: {
    bg: "bg-severity-medium/20",
    text: "text-severity-medium",
    border: "border-severity-medium/30",
    dot: "bg-severity-medium",
    pulse: false,
    label: "Sev3"
  },
  sev4: {
    bg: "bg-severity-low/20",
    text: "text-severity-low",
    border: "border-severity-low/30",
    dot: "bg-severity-low",
    pulse: false,
    label: "Sev4"
  }
};

export function SeverityBadge({ severity, className }) {
  const config = severityConfig[severity] || severityConfig.sev4;

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
      {config.label}
    </span>
  );
}
