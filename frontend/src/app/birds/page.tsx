"use client";

import dynamic from "next/dynamic";
import { useBirdSightings, REGIONS } from "@/hooks/useBirdSightings";
import { BirdFilters } from "@/components/birds/BirdFilters";
import { BirdStats } from "@/components/birds/BirdStats";
import { BirdList } from "@/components/birds/BirdList";
import { BirdDetails } from "@/components/birds/BirdDetails";

const BirdMap = dynamic(() => import("./BirdMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900">
            <p className="text-muted-foreground">Loading map...</p>
        </div>
    ),
});

export default function BirdsPage() {
    const {
        sightings,
        baseSightings,
        isLoading,
        filters,
        setFilters,
        stats,
        speciesDistribution,
        mapRef,
        selectedSighting,
        setSelectedSighting,
        toggleSpeciesFilter,
        region,
        setRegion,
    } = useBirdSightings();

    const handleRegionChange = (newRegion: string) => {
        setRegion(newRegion as typeof region);
        const regionConfig = REGIONS.find(r => r.code === newRegion);
        if (regionConfig && mapRef.current) {
            mapRef.current.flyTo(regionConfig.center, regionConfig.zoom, { duration: 1 });
        }
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <BirdMap
                    sightings={sightings}
                    onSightingClick={setSelectedSighting}
                    mapRef={mapRef}
                    selectedSighting={selectedSighting}
                />
            </div>

            {/* TOP-LEFT: Filters */}
            <div className="absolute top-4 left-4 z-10 w-56">
                <BirdFilters
                    config={filters}
                    onChange={setFilters}
                    region={region}
                    onRegionChange={handleRegionChange}
                />
            </div>

            {/* TOP-RIGHT: Stats */}
            <div className="absolute top-4 right-4 z-10 w-56">
                <BirdStats
                    stats={stats}
                    distribution={speciesDistribution}
                    activeSpecies={filters.speciesFilter}
                    onToggleSpecies={toggleSpeciesFilter}
                    regionCode={region}
                />
            </div>

            {/* BOTTOM-LEFT: Details */}
            <div className="absolute bottom-4 left-4 z-10 w-56">
                {selectedSighting && <BirdDetails data={selectedSighting} />}
            </div>

            {/* BOTTOM-RIGHT: List */}
            <div className="absolute bottom-4 right-4 z-10 w-56 max-h-[35vh]">
                <BirdList
                    items={sightings}
                    loading={isLoading}
                    selection={selectedSighting}
                    onSelect={setSelectedSighting}
                />
            </div>
        </div>
    );
}
