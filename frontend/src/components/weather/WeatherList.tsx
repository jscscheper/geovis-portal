import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sun, CloudSun, Cloud, CloudFog, CloudRain, CloudSnow, Snowflake, CloudLightning, HelpCircle } from "lucide-react";
import { WeatherStation } from "@/types";
import { getTemperatureColor, getWeatherDescription, WeatherIconType } from "@/hooks/useWeatherStations";

interface Props {
    items: WeatherStation[];
    selection: WeatherStation | null;
    onSelect: (station: WeatherStation) => void;
    loading: boolean;
}

const ICONS = {
    sun: Sun,
    "cloud-sun": CloudSun,
    cloud: Cloud,
    fog: CloudFog,
    rain: CloudRain,
    snow: CloudSnow,
    snowflake: Snowflake,
    storm: CloudLightning,
    unknown: HelpCircle,
};

export function WeatherList({ items, selection, onSelect, loading }: Props) {
    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 !gap-0 !py-0 flex-1 min-h-0 flex flex-col">
            <div className="p-3 border-b border-border/50 flex justify-between items-center bg-card/50">
                <span className="text-xs font-medium text-muted-foreground">Stations</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {items.length}
                </Badge>
            </div>

            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
                ) : (
                    <div className="p-2 space-y-1">
                        {items.sort((a, b) => (b.temperature ?? -100) - (a.temperature ?? -100)).map((item, i) => {
                            const temp = item.temperature;
                            const color = getTemperatureColor(temp ?? NaN);
                            const weather = getWeatherDescription(item.weatherCode ?? -1);
                            const isSelected = selection?.id === item.id;
                            const Icon = ICONS[weather.icon] || HelpCircle;

                            return (
                                <div
                                    key={`${item.id}-${i}`}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer border transition-colors ${isSelected
                                            ? "bg-primary/10 border-primary/40"
                                            : "border-transparent hover:bg-accent/50"
                                        }`}
                                    onClick={() => onSelect(item)}
                                >
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-xs font-medium truncate text-foreground/90">{item.name}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Icon className="w-3 h-3" />
                                            {weather.description}
                                        </p>
                                    </div>
                                    {temp !== undefined && !isNaN(temp) && (
                                        <Badge className="h-5 text-[10px]" style={{ backgroundColor: color, color: "#000" }}>
                                            {temp.toFixed(1)}°
                                        </Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
