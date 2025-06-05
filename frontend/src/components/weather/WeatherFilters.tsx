import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudSun, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeatherFilters as FilterConfig, WEATHER_REGIONS } from "@/hooks/useWeatherStations";

interface Props {
    config: FilterConfig;
    onChange: (config: FilterConfig) => void;
    onReset: () => void;
    hasFilter: boolean;
    region: string;
    onRegionChange: (region: any) => void;
}

export function WeatherFilters({ config, onChange, onReset, hasFilter, region, onRegionChange }: Props) {
    return (
        <Card className="bg-card/90 backdrop-blur border-border/50 p-3 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium text-sm">Weather</span>
                </div>
                {hasFilter && (
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

            <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="bg-background/50 h-7 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {WEATHER_REGIONS.map((r) => (
                        <SelectItem key={r.code} value={r.code} className="text-xs">
                            {r.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Card>
    );
}
