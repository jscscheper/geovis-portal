import { Card } from "@/components/ui/card";
import { Sun, Moon, Wind, Droplets, CloudSun, Cloud, CloudFog, CloudRain, CloudSnow, Snowflake, CloudLightning, HelpCircle } from "lucide-react";
import { WeatherStation } from "@/types";
import { getTemperatureColor, getWeatherDescription, WeatherIconType } from "@/hooks/useWeatherStations";

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

function WeatherIcon({ type, className }: { type: WeatherIconType; className?: string }) {
    const Icon = ICONS[type] || ICONS.unknown;
    return <Icon className={className} />;
}

export function WeatherDetails({ data }: { data: WeatherStation }) {
    const weather = getWeatherDescription(data.weatherCode ?? -1);

    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 !gap-0 !py-0">
            <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold truncate max-w-[120px]">{data.name}</p>
                        <p className="text-xs text-muted-foreground">{data.id}</p>
                    </div>
                    {data.temperature !== undefined && (
                        <div className="text-right">
                            <p className="text-2xl font-bold" style={{ color: getTemperatureColor(data.temperature) }}>
                                {data.temperature.toFixed(1)}°C
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                <WeatherIcon type={weather.icon} className="w-3 h-3" />
                                {weather.description}
                            </p>
                        </div>
                    )}
                </div>

                {data.apparentTemperature !== undefined && (
                    <div className="flex items-center justify-between text-xs bg-background/20 px-2 py-1 rounded">
                        <span className="text-muted-foreground">Feels like</span>
                        <span className="font-medium" style={{ color: getTemperatureColor(data.apparentTemperature) }}>
                            {data.apparentTemperature.toFixed(1)}°C
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                    <StatBox icon={Droplets} value={data.humidity?.toFixed(0) + "%"} />
                    <StatBox
                        icon={Wind}
                        value={data.windSpeed?.toFixed(0) + " km/h"}
                        rotate={(data.windDirection ?? 0) + 180}
                    />
                    <StatBox
                        icon={Sun}
                        value={"UV " + data.uvIndex?.toFixed(0)}
                        color={getUVColor(data.uvIndex)}
                    />
                    <StatBox
                        icon={data.isDay ? Sun : Moon}
                        value={data.isDay ? 'Day' : 'Night'}
                    />
                </div>
            </div>
        </Card>
    );
}

function StatBox({ icon: Icon, value, rotate, color }: { icon: any, value: string, rotate?: number, color?: string }) {
    if (!value || value.includes("undefined")) return null;
    return (
        <div className="bg-background/30 p-1.5 rounded flex flex-col items-center gap-0.5">
            <Icon className="w-4 h-4 text-muted-foreground" style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }} />
            <p className="font-medium truncate w-full" style={{ color }}>{value}</p>
        </div>
    );
}

function getUVColor(uv: number | undefined) {
    if (uv === undefined) return undefined;
    if (uv < 3) return '#4caf50';
    if (uv < 6) return '#ffeb3b';
    if (uv < 8) return '#ff9800';
    return '#f44336';
}
