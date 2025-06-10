"use client";

import dynamic from "next/dynamic";
import { useWeatherStations, WEATHER_REGIONS } from "@/hooks/useWeatherStations";
import { WeatherFilters } from "@/components/weather/WeatherFilters";
import { WeatherStats } from "@/components/weather/WeatherStats";
import { WeatherList } from "@/components/weather/WeatherList";
import { WeatherDetails } from "@/components/weather/WeatherDetails";

const WeatherMap = dynamic(() => import("./WeatherMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900">
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
});

export default function WeatherPage() {
    const {
        stations,
        baseStations,
        isLoading,
        filters,
        setFilters,
        stats,
        distribution,
        mapRef,
        selectedStation,
        setSelectedStation,
        toggleTempFilter,
        clearTempFilter,
        resetAllFilters,
        region,
        setRegion,
    } = useWeatherStations();

    const handleRegionChange = (newRegion: string) => {
        setRegion(newRegion as typeof region);
        const regionConfig = WEATHER_REGIONS.find(r => r.code === newRegion);
        if (regionConfig && mapRef.current) {
            mapRef.current.flyTo(regionConfig.center, regionConfig.zoom, { duration: 1 });
        }
    };

    const hasActiveFilters = filters.searchText.length > 0 || filters.tempFilter !== null;

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <WeatherMap
                    stations={stations}
                    onStationClick={setSelectedStation}
                    mapRef={mapRef}
                    selectedStation={selectedStation}
                />
            </div>

            {/* TOP-LEFT: Filters */}
            <div className="absolute top-4 left-4 z-10 w-56">
                <WeatherFilters
                    config={filters}
                    onChange={setFilters}
                    onReset={resetAllFilters}
                    hasFilter={hasActiveFilters}
                    region={region}
                    onRegionChange={handleRegionChange}
                />
            </div>

            {/* TOP-RIGHT: Stats */}
            <div className="absolute top-4 right-4 z-10 w-56">
                <WeatherStats
                    stats={stats}
                    distribution={distribution}
                    activeFilter={filters.tempFilter}
                    onToggleFilter={toggleTempFilter}
                    onClearFilter={clearTempFilter}
                    totalCount={baseStations.length}
                />
            </div>

            {/* BOTTOM-LEFT: Details */}
            <div className="absolute bottom-4 left-4 z-10 w-56">
                {selectedStation && <WeatherDetails data={selectedStation} />}
            </div>

            {/* BOTTOM-RIGHT: List */}
            <div className="absolute bottom-4 right-4 z-10 w-56 max-h-[35vh]">
                <WeatherList
                    items={stations}
                    selection={selectedStation}
                    onSelect={setSelectedStation}
                    loading={isLoading}
                />
            </div>
        </div>
    );
}
