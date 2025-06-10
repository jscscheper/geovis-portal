"use client";

import dynamic from "next/dynamic";
import { useAirQuality } from "@/hooks/useAirQuality";
import { AirQualityFilters } from "@/components/airquality/AirQualityFilters";
import { AirQualityStats } from "@/components/airquality/AirQualityStats";
import { AirQualityList } from "@/components/airquality/AirQualityList";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AirQualityMap = dynamic(() => import("./AirQualityMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900">
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
});

export default function AirQualityPage() {
    const {
        stations,
        baseStations,
        isLoading,
        filters,
        setFilters,
        summary,
        distribution,
        selectedStation,
        setSelectedStation,
        mapRef,
        toggleAqiFilter,
        resetAllFilters,
        setPollutant,
    } = useAirQuality();

    const historyData = selectedStation?.historyTime?.reduce((acc, time, i) => {
        if (i % 6 === 0) {
            const date = new Date(time);
            const pm25Val = selectedStation.historyPm25?.[i];
            const pm10Val = selectedStation.historyPm10?.[i];
            acc.push({
                time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                pm25: pm25Val !== undefined && pm25Val >= 0 ? pm25Val : null,
                pm10: pm10Val !== undefined && pm10Val >= 0 ? pm10Val : null,
            });
        }
        return acc;
    }, [] as any[]) || [];

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <AirQualityMap
                    stations={stations}
                    pollutant={filters.pollutant}
                    onStationClick={setSelectedStation}
                    mapRef={mapRef}
                    selectedStation={selectedStation}
                />
            </div>

            {/* TOP-LEFT: Filters */}
            <div className="absolute top-4 left-4 z-10 w-56">
                <AirQualityFilters
                    config={filters}
                    onChange={setFilters}
                    onReset={resetAllFilters}
                    onPollutantChange={setPollutant}
                    count={stations.length}
                    total={baseStations.length}
                />
            </div>

            {/* TOP-RIGHT: Stats */}
            <div className="absolute top-4 right-4 z-10 w-56">
                <AirQualityStats
                    summary={summary}
                    distribution={distribution}
                    activeFilter={filters.activeFilter}
                    onToggleFilter={toggleAqiFilter}
                />
            </div>

            {/* BOTTOM-LEFT: History chart */}
            <div className="absolute bottom-4 left-4 z-10 w-56">
                <Card className="bg-card/80 backdrop-blur-md border-border/50 p-3">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 truncate">
                        {selectedStation ? selectedStation.name : "Select a station"}
                    </h3>
                    {selectedStation && historyData.length > 0 ? (
                        <div className="h-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <XAxis dataKey="time" tick={{ fill: "#888", fontSize: 8 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#888", fontSize: 9 }} axisLine={false} tickLine={false} width={20} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "4px", fontSize: "11px" }}
                                    />
                                    <Line type="monotone" dataKey="pm25" stroke="#00bcd4" strokeWidth={2} dot={false} name="PM2.5" />
                                    <Line type="monotone" dataKey="pm10" stroke="#ff9800" strokeWidth={2} dot={false} name="PM10" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground text-center py-3 bg-muted/20 rounded">
                            {selectedStation ? "No history" : "Click a marker"}
                        </div>
                    )}
                </Card>
            </div>

            {/* BOTTOM-RIGHT: List */}
            <div className="absolute bottom-4 right-4 z-10 w-56 max-h-[35vh]">
                <AirQualityList
                    items={stations}
                    pollutant={filters.pollutant}
                    loading={isLoading}
                    selection={selectedStation}
                    onSelect={setSelectedStation}
                />
            </div>
        </div>
    );
}
