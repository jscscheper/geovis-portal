"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { Earthquake } from "@/types";
import { EarthquakeFilters } from "@/components/earthquake/EarthquakeFilters";
import { EarthquakeStats } from "@/components/earthquake/EarthquakeStats";
import { EarthquakeList } from "@/components/earthquake/EarthquakeList";

const EarthquakeMap = dynamic(() => import("./EarthquakeMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900">
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
});

export default function EarthquakePage() {
    const {
        earthquakes,
        baseEarthquakes,
        isLoading,
        filters,
        setFilters,
        magnitudeDistribution,
        magnitudeRange,
        mapRef,
        toggleMagnitudeFilter,
        clearMagnitudeFilter,
        resetAllFilters,
    } = useEarthquakes();

    const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

    const chartData = magnitudeDistribution.labels.map((label, i) => ({
        name: label,
        count: magnitudeDistribution.bins[i],
        fill: magnitudeDistribution.colors[i],
        range: magnitudeDistribution.ranges[i],
        isActive: filters.magnitudeRangeFilter?.label === magnitudeDistribution.ranges[i]?.label,
    }));

    const handleBarClick = (index: number) => {
        const range = magnitudeDistribution.ranges[index];
        if (range) toggleMagnitudeFilter(range);
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <EarthquakeMap
                    earthquakes={earthquakes}
                    distribution={magnitudeDistribution}
                    mapRef={mapRef}
                    selectedEarthquake={selectedEarthquake}
                />
            </div>

            {/* TOP-LEFT: Filters */}
            <div className="absolute top-4 left-4 z-10 w-56">
                <EarthquakeFilters
                    config={filters}
                    onChange={setFilters}
                    minMag={magnitudeRange.min}
                    maxMag={magnitudeRange.max}
                    onReset={resetAllFilters}
                    distribution={magnitudeDistribution}
                    onClearMagFilter={clearMagnitudeFilter}
                    currentCount={earthquakes.length}
                    totalCount={baseEarthquakes.length}
                />
            </div>

            {/* TOP-RIGHT: Stats chart */}
            <div className="absolute top-4 right-4 z-10 w-56">
                <EarthquakeStats
                    data={chartData}
                    onBarClick={handleBarClick}
                    hasActiveFilter={filters.magnitudeRangeFilter !== null}
                />
            </div>

            {/* BOTTOM-RIGHT: List */}
            <div className="absolute bottom-4 right-4 z-10 w-56 max-h-[35vh]">
                <EarthquakeList
                    items={earthquakes}
                    selection={selectedEarthquake}
                    onSelect={setSelectedEarthquake}
                    loading={isLoading}
                />
            </div>
        </div>
    );
}
