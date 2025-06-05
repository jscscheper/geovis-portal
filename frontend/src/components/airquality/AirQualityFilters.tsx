import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wind, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pollutant } from "@/types";
import { AirQualityFilters as FilterConfig, AQI_COLORS } from "@/hooks/useAirQuality";

interface Props {
    config: FilterConfig;
    onChange: (f: FilterConfig) => void;
    onReset: () => void;
    onPollutantChange: (p: Pollutant) => void;
    count: number;
    total: number;
}

const POLLUTANTS: { value: Pollutant; label: string }[] = [
    { value: "pm25", label: "PM2.5" },
    { value: "pm10", label: "PM10" },
    { value: "no2", label: "NO₂" },
    { value: "o3", label: "O₃" },
    { value: "co", label: "CO" },
    { value: "so2", label: "SO₂" },
];

const LEGEND = [
    { label: "Good", color: AQI_COLORS.good },
    { label: "Mod", color: AQI_COLORS.moderate },
    { label: "Unhealthy", color: AQI_COLORS.unhealthySensitive },
];

export function AirQualityFilters({ config, onChange, onReset, onPollutantChange, count, total }: Props) {
    const hasActive = config.searchText || config.activeFilter;

    return (
        <Card className="bg-card/90 backdrop-blur border-border/50 p-3 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-sm">Air Quality</span>
                </div>
                {hasActive && (
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onReset}>
                        <RotateCcw className="w-3 h-3" />
                    </Button>
                )}
            </div>

            <Input
                placeholder="Search..."
                value={config.searchText}
                onChange={(e) => onChange({ ...config, searchText: e.target.value })}
                className="bg-background/50 h-7 text-xs"
            />

            <Select value={config.pollutant} onValueChange={onPollutantChange}>
                <SelectTrigger className="bg-background/50 h-7 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {POLLUTANTS.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-xs">
                            {p.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex gap-2 text-[9px]">
                {LEGEND.map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.label}</span>
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-muted-foreground">{count}/{total} stations</p>
        </Card>
    );
}
