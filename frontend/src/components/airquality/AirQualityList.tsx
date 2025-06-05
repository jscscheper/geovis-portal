import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AirQualityStation, Pollutant } from "@/types";
import { AQI_COLORS, getAQILevel, getPollutantValue } from "@/hooks/useAirQuality";

interface Props {
    items: AirQualityStation[];
    pollutant: Pollutant;
    loading: boolean;
    selection: AirQualityStation | null;
    onSelect: (station: AirQualityStation) => void;
}

const EU_AQI_SCALE: Record<number, string> = {
    1: "#50f0e6",
    2: "#50ccaa",
    3: "#f0e641",
    4: "#ff5050",
    5: "#960032",
};

export function AirQualityList({ items, pollutant, loading, selection, onSelect }: Props) {
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
                        {items
                            .sort((a, b) => getPollutantValue(b, pollutant) - getPollutantValue(a, pollutant))
                            .slice(0, 50)
                            .map((station, i) => {
                                const value = getPollutantValue(station, pollutant);
                                const level = getAQILevel(value, pollutant);
                                const color = AQI_COLORS[level];
                                const isSelected = selection?.name === station.name && selection?.latLon[0] === station.latLon[0];

                                return (
                                    <div
                                        key={`${station.name}-${i}`}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer border transition-colors ${isSelected
                                                ? "bg-primary/10 border-primary/40"
                                                : "border-transparent hover:bg-accent/50"
                                            }`}
                                        onClick={() => onSelect(station)}
                                    >
                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="text-xs font-medium truncate text-foreground/90">{station.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">
                                                {station.city}, {station.country}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {station.europeanAqi && station.europeanAqi > 0 && (
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: EU_AQI_SCALE[station.europeanAqi] || "#666" }}
                                                    title={`EU AQI: ${station.europeanAqi}`}
                                                />
                                            )}
                                            <Badge className="h-5 text-[10px]" style={{ backgroundColor: color, color: "#000" }}>
                                                {value.toFixed(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
