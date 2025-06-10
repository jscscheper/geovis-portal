"use client";

import Link from "next/link";
import { Globe, CloudSun, Wind, Bird, Gauge } from "lucide-react";

const dashboards = [
  { path: "/earthquake", label: "Earthquakes", icon: Globe, color: "#f97316" },
  { path: "/weather", label: "Weather", icon: CloudSun, color: "#facc15" },
  { path: "/airquality", label: "Air Quality", icon: Wind, color: "#22c55e" },
  { path: "/birds", label: "Birds", icon: Bird, color: "#3b82f6" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">GeoVis Portal</h1>
        <p className="text-zinc-400">environmental data visualization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl w-full">
        {dashboards.map(({ path, label, icon: Icon, color }) => (
          <Link
            key={path}
            href={path}
            className="group flex flex-col items-center gap-3 p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-900 transition-all"
          >
            <div
              className="p-4 rounded-full bg-zinc-800 group-hover:scale-110 transition-transform"
              style={{ color }}
            >
              <Icon size={28} />
            </div>
            <span className="text-zinc-200 font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/benchmark"
        className="mt-16 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
      >
        <Gauge size={14} />
        <span>API Benchmark</span>
      </Link>

      <p className="mt-8 text-zinc-700 text-xs">v2.0 jscscheper</p>
    </main>
  );
}
