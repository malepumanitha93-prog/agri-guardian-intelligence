import { createFileRoute } from "@tanstack/react-router";
import { Droplets, ThermometerSun, Wind, Leaf, CloudSun, Sprout, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
  RadialBarChart, RadialBar, PolarAngleAxis,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgroShield AI" },
      { name: "description", content: "Smart farming dashboard with weather, soil, and crop health analytics." },
    ],
  }),
  component: Dashboard,
});

const moistureData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}h`,
  moisture: 40 + Math.round(Math.sin(i / 1.5) * 15 + Math.random() * 8),
  temp: 22 + Math.round(Math.cos(i / 2) * 5 + Math.random() * 3),
}));

const waterData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  used: 220 + Math.round(Math.random() * 180),
  saved: 80 + Math.round(Math.random() * 60),
}));

const cropHealth = [{ name: "health", value: 87, fill: "oklch(0.62 0.18 150)" }];

function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero */}
      <div className="glass rounded-3xl p-6 md:p-8 shadow-elegant relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live · North Field A2
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Good morning, <span className="gradient-text">Karthik</span>
            </h1>
            <p className="mt-2 text-muted-foreground max-w-lg">
              Your fields are thriving. AI detected optimal conditions for tomato crops today — irrigation auto-scheduled at 6 PM.
            </p>
          </div>
          <div className="flex items-center gap-4 glass-strong rounded-2xl p-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground animate-pulse-glow">
              <CloudSun className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Today</div>
              <div className="font-display text-2xl font-bold">28°C</div>
              <div className="text-xs text-muted-foreground">Partly cloudy · 64% humidity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Soil Moisture" value="58%" delta="+4% vs yesterday" icon={Droplets} tint="info" />
        <StatCard label="Temperature" value="28°C" delta="Ideal range" icon={ThermometerSun} tint="warning" />
        <StatCard label="Air Quality" value="42 AQI" delta="Good" icon={Wind} tint="accent" />
        <StatCard label="Crop Health" value="87%" delta="↑ 2.1%" icon={Sprout} tint="primary" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Soil Moisture & Temperature</h3>
              <p className="text-xs text-muted-foreground">Last 24 hours · auto-synced</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Moisture</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Temp</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={moistureData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.18 150)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.62 0.18 150)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.16 200)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.7 0.16 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
              <XAxis dataKey="hour" stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="moisture" stroke="oklch(0.62 0.18 150)" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="temp" stroke="oklch(0.7 0.16 200)" strokeWidth={2.5} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elegant flex flex-col">
          <div>
            <h3 className="font-display font-semibold text-lg">Overall Crop Health</h3>
            <p className="text-xs text-muted-foreground">AI computed score</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart innerRadius="75%" outerRadius="100%" data={cropHealth} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(0.9 0.02 160 / 0.4)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="font-display text-5xl font-bold gradient-text">87%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Excellent</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><div className="text-xs text-muted-foreground">Tomato</div><div className="font-semibold text-success">92%</div></div>
            <div><div className="text-xs text-muted-foreground">Rice</div><div className="font-semibold text-success">85%</div></div>
            <div><div className="text-xs text-muted-foreground">Wheat</div><div className="font-semibold text-warning">78%</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Water Usage</h3>
              <p className="text-xs text-muted-foreground">Liters · weekly</p>
            </div>
            <div className="text-xs flex items-center gap-1 text-success font-medium">
              <TrendingUp className="h-3 w-3" /> 32% saved by AI scheduling
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
              <XAxis dataKey="day" stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="used" stroke="oklch(0.7 0.16 200)" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="saved" stroke="oklch(0.62 0.18 150)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elegant">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" /> AI Recommendations
          </h3>
          <ul className="mt-4 space-y-3">
            {[
              { title: "Reduce nitrogen", desc: "Soil shows 12% surplus N — pause urea for 4 days." },
              { title: "Pest watch", desc: "Aphid risk rising on east plot. Deploy neem spray tonight." },
              { title: "Irrigation", desc: "Skip tomorrow's cycle — rain probability 78%." },
            ].map((r) => (
              <li key={r.title} className="rounded-xl border border-border/60 p-3 hover:border-primary/40 transition group">
                <div className="font-medium text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:animate-pulse" />
                  {r.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
