import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Globe, RotateCcw } from "lucide-react";
import { EarthquakeFilters as FilterConfig } from "@/hooks/useEarthquakes";

interface Props {
    config: FilterConfig;
    onChange: (config: FilterConfig) => void;
    minMag: number;
    maxMag: number;
    onReset: () => void;
    distribution: any;
    onClearMagFilter: () => void;
    currentCount: number;
    totalCount: number;
}

const PRESETS = [
    { label: "30D", days: 30 },
    { label: "1Y", days: 365 },
    { label: "All", days: 0 },
];

export function EarthquakeFilters({ config, onChange, minMag, maxMag, onReset, currentCount, totalCount }: Props) {
    const setDateRange = (days: number) => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        let start = "2000-01-01";
        if (days > 0) {
            const d = new Date();
            d.setDate(d.getDate() - days);
            start = d.toISOString().split("T")[0];
        }
        onChange({ ...config, startDate: start, endDate: end });
    };

    return (
        <Card className="bg-card/90 backdrop-blur border-border/50 p-3 space-y-2 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-sm">Earthquakes</span>
                </div>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onReset}>
                    <RotateCcw className="w-3 h-3" />
                </Button>
            </div>

            <Input
                placeholder="Search..."
                value={config.searchText}
                onChange={(e) => onChange({ ...config, searchText: e.target.value })}
                className="bg-background/50 h-7 text-xs"
            />

            <div>
                <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Magnitude</span>
                    <span>{config.magnitudeMin.toFixed(1)} - {config.magnitudeMax.toFixed(1)}</span>
                </div>
                <Slider
                    value={[config.magnitudeMin, config.magnitudeMax]}
                    onValueChange={([min, max]) => onChange({ ...config, magnitudeMin: min, magnitudeMax: max })}
                    min={minMag}
                    max={maxMag}
                    step={0.1}
                />
            </div>

            <div className="flex gap-1">
                {PRESETS.map((p) => (
                    <Button
                        key={p.label}
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] flex-1 bg-background/50"
                        onClick={() => setDateRange(p.days)}
                    >
                        {p.label}
                    </Button>
                ))}
            </div>

            <p className="text-[10px] text-muted-foreground">{currentCount}/{totalCount} events</p>
        </Card>
    );
}
