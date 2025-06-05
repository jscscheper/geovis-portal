import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

interface Props {
    stats: { min: number; avg: number; max: number; count: number };
    distribution: any[];
    activeFilter: any;
    onToggleFilter: (range: any) => void;
    onClearFilter: () => void;
    totalCount: number;
}

export function WeatherStats({ stats, distribution, activeFilter, onToggleFilter }: Props) {
    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 p-3">
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold mb-2">
                <div>
                    <p className="text-cyan-400">{stats.min.toFixed(0)}°</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Min</p>
                </div>
                <div>
                    <p className="text-green-400">{stats.avg.toFixed(0)}°</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Avg</p>
                </div>
                <div>
                    <p className="text-orange-400">{stats.max.toFixed(0)}°</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Max</p>
                </div>
                <div>
                    <p className="text-foreground">{stats.count}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Total</p>
                </div>
            </div>
            <div style={{ height: 60 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 8 }} tickLine={false} axisLine={false} />
                        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                            {distribution.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.fill}
                                    stroke={entry.isActive ? "#fff" : "none"}
                                    strokeWidth={1}
                                    onClick={() => onToggleFilter({ name: entry.name, min: entry.min, max: entry.max, color: entry.color })}
                                    style={{ cursor: "pointer", opacity: activeFilter && !entry.isActive ? 0.3 : 0.8 }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
