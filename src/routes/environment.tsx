import { createFileRoute } from "@tanstack/react-router";
import { Wind, Droplets, Trees, Factory, Sun, CloudRain, Thermometer } from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
  AreaChart, Area,
} from "recharts";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/environment")({
  head: () => ({
    meta: [
      { title: "Environment Monitoring — AgroShield AI" },
      { name: "description", content: "Live air quality, pollution charts, climate insights, and smart irrigation suggestions." },
    ],
  }),
  component: EnvPage,
});

const pollutionData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  pm25: 20 + Math.round(Math.sin(i / 2) * 18 + Math.random() * 10 + 25),
  co2: 380 + Math.round(Math.sin(i / 3) * 25 + i * 2),
}));

const climateData = Array.from({ length: 10 }, (_, i) => ({
  year: `${2015 + i}`,
  temp: 26 + i * 0.12 + Math.random() * 0.3,
}));

const aqi = [{ name: "aqi", value: 42, fill: "oklch(0.65 0.18 150)" }];

function EnvPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Environment <span className="gradient-text">Monitoring</span>
        </h1>
        <p className="text-muted-foreground mt-2">Real-time air, water, and climate intelligence for your region.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Air Quality" value="42" delta="Good" icon={Wind} tint="primary" />
        <StatCard label="Humidity" value="64%" icon={Droplets} tint="info" />
        <StatCard label="UV Index" value="6.2" delta="High" icon={Sun} tint="warning" />
        <StatCard label="Rainfall (7d)" value="38 mm" icon={CloudRain} tint="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 shadow-elegant flex flex-col">
          <h3 className="font-display font-semibold text-lg">Air Quality Index</h3>
          <p className="text-xs text-muted-foreground">Current reading · PM2.5 based</p>
          <div className="flex-1 relative flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={aqi} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 300]} tick={false} />
                <RadialBar background={{ fill: "oklch(0.9 0.02 160 / 0.4)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="font-display text-5xl font-bold gradient-text">42</div>
              <div className="text-xs uppercase tracking-wider text-success mt-1 font-semibold">Good</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
            <div><div className="text-muted-foreground">PM2.5</div><div className="font-semibold">18</div></div>
            <div><div className="text-muted-foreground">O₃</div><div className="font-semibold">32</div></div>
            <div><div className="text-muted-foreground">NO₂</div><div className="font-semibold">21</div></div>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display font-semibold text-lg">Pollution Trends</h3>
              <p className="text-xs text-muted-foreground">PM2.5 & CO₂ · last 12 months</p>
            </div>
            <Factory className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pollutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
              <XAxis dataKey="month" stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="pm25" fill="oklch(0.7 0.16 200)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="co2" fill="oklch(0.62 0.18 150)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-warning" /> Climate Change Awareness
              </h3>
              <p className="text-xs text-muted-foreground">Regional average temperature trend</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning font-medium">+1.2°C / decade</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={climateData}>
              <defs>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.17 80)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.78 0.17 80)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
              <XAxis dataKey="year" stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0 0 / 0.5)" fontSize={11} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="temp" stroke="oklch(0.78 0.17 80)" strokeWidth={3} fill="url(#ge)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-success/10 p-3">
              <Trees className="h-5 w-5 mx-auto text-success mb-1" />
              <div className="text-xs text-muted-foreground">Trees planted</div>
              <div className="font-semibold">1.2K</div>
            </div>
            <div className="rounded-xl bg-info/10 p-3">
              <Droplets className="h-5 w-5 mx-auto text-info mb-1" />
              <div className="text-xs text-muted-foreground">Water saved</div>
              <div className="font-semibold">8,420 L</div>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Wind className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">CO₂ offset</div>
              <div className="font-semibold">320 kg</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elegant">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Droplets className="h-5 w-5 text-info" /> Smart Irrigation
          </h3>
          <p className="text-xs text-muted-foreground mb-4">AI suggested schedule</p>
          <div className="space-y-3">
            {[
              { zone: "Zone A · Tomato", time: "Tomorrow 5:30 AM", liters: "180 L", status: "Optimal" },
              { zone: "Zone B · Wheat", time: "Skip (rain expected)", liters: "0 L", status: "Saved" },
              { zone: "Zone C · Rice", time: "Today 6:00 PM", liters: "420 L", status: "Scheduled" },
              { zone: "Zone D · Chili", time: "Tomorrow 6:00 AM", liters: "95 L", status: "Optimal" },
            ].map((z) => (
              <div key={z.zone} className="rounded-xl border border-border/60 p-3 hover:border-primary/40 transition">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{z.zone}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    z.status === "Saved" ? "bg-success/15 text-success" :
                    z.status === "Scheduled" ? "bg-info/15 text-info" : "bg-primary/15 text-primary"
                  }`}>{z.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                  <span>{z.time}</span>
                  <span className="font-medium">{z.liters}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
