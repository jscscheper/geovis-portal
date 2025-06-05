"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface DistributionItem {
    name: string;
    count: number;
    fill: string;
    isActive?: boolean;
}

interface DistributionChartProps {
    data: DistributionItem[];
    height?: number;
    onBarClick?: (index: number) => void;
    hasActiveFilter?: boolean;
}

export function DistributionChart({
    data,
    height = 70,
    onBarClick,
    hasActiveFilter = false,
}: DistributionChartProps) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#888", fontSize: 9 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#888", fontSize: 9 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "6px",
                            fontSize: "12px",
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]} activeBar={false}>
                        {data.map((entry, i) => (
                            <Cell
                                key={i}
                                fill={entry.fill}
                                stroke={entry.isActive ? "#fff" : "transparent"}
                                strokeWidth={entry.isActive ? 2 : 0}
                                onClick={() => onBarClick?.(i)}
                                style={{
                                    cursor: onBarClick ? "pointer" : "default",
                                    opacity: hasActiveFilter && !entry.isActive ? 0.3 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
