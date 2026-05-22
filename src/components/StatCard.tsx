import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tint?: "primary" | "accent" | "warning" | "info";
  className?: string;
};

const tints: Record<NonNullable<Props["tint"]>, string> = {
  primary: "from-primary/20 to-primary-glow/10 text-primary",
  accent: "from-accent/20 to-info/10 text-accent",
  warning: "from-warning/30 to-warning/10 text-warning",
  info: "from-info/20 to-accent/10 text-info",
};

export function StatCard({ label, value, delta, icon: Icon, tint = "primary", className }: Props) {
  return (
    <div className={cn(
      "glass rounded-2xl p-5 shadow-elegant relative overflow-hidden group hover:-translate-y-1 transition-all duration-300",
      className,
    )}>
      <div className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60", tints[tint])} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
          <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center", tints[tint])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</div>
        {delta && <div className="mt-1 text-xs text-success font-medium">{delta}</div>}
      </div>
    </div>
  );
}
