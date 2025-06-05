"use client";

import useSWR from "swr";
import { useMemo, useState, useRef } from "react";

import { BirdSighting } from "@/types";
import { API_BASE, fetcher } from "@/lib/api";

// Simple color mapping for bird groups
// Keywords prioritized by likelihood of partial match
const COLOR_MAP: Record<string, string> = {
    "duck": "#4fc3f7", "goose": "#4fc3f7", "swan": "#4fc3f7", // Waterfowl
    "hawk": "#f44336", "eagle": "#f44336", "falcon": "#f44336", // Raptors
    "owl": "#9c27b0",
    "gull": "#90a4ae", "tern": "#90a4ae", // Seabirds
    "warbler": "#ffeb3b", "finch": "#ffeb3b", // Songbirds
    "heron": "#e91e63", "egret": "#e91e63",
    "crow": "#424242", "raven": "#424242", "magpie": "#424242",
};

export function getBirdColor(speciesCode: string): string {
    const code = speciesCode.toLowerCase();

    // Find first matching key
    for (const [key, color] of Object.entries(COLOR_MAP)) {
        if (code.includes(key) || key.includes(code)) return color; // flexible match
    }

    return "#4caf50"; // default green
}

export interface BirdFilters {
    searchText: string;
    speciesFilter: string | null;
}

export const REGIONS = [
    { code: "NL", name: "Netherlands", center: [52.1326, 5.2913] as [number, number], zoom: 7 },
    { code: "DE", name: "Germany", center: [51.1657, 10.4515] as [number, number], zoom: 6 },
    { code: "GB", name: "United Kingdom", center: [55.3781, -3.4360] as [number, number], zoom: 6 },
    { code: "US", name: "United States", center: [39.8283, -98.5795] as [number, number], zoom: 4 },
    { code: "AU", name: "Australia", center: [-25.2744, 133.7751] as [number, number], zoom: 4 },
    { code: "ZA", name: "South Africa", center: [-30.5595, 22.9375] as [number, number], zoom: 5 },
    { code: "BR", name: "Brazil", center: [-14.2350, -51.9253] as [number, number], zoom: 4 },
    { code: "JP", name: "Japan", center: [36.2048, 138.2529] as [number, number], zoom: 5 },
] as const;

export type RegionCode = typeof REGIONS[number]["code"];

export function useBirdSightings(initialRegion: RegionCode = "NL") {
    const mapRef = useRef<L.Map | null>(null);

    const [region, setRegion] = useState<RegionCode>(initialRegion);

    const [filters, setFilters] = useState<BirdFilters>({
        searchText: "",
        speciesFilter: null,
    });

    const [selectedSighting, setSelectedSighting] = useState<BirdSighting | null>(null);

    const { data: rawData, error, isLoading, mutate } = useSWR<BirdSighting[]>(
        `${API_BASE}/birddata?region=${region}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    // Initial search filter
    const sightingsByText = useMemo(() => {
        if (!rawData) return [];
        const q = filters.searchText.toLowerCase().trim();
        if (!q) return rawData;

        return rawData.filter((s) =>
            s.comName?.toLowerCase().includes(q) ||
            s.sciName?.toLowerCase().includes(q) ||
            s.locName?.toLowerCase().includes(q)
        );
    }, [rawData, filters.searchText]);

    // Secondary species filter
    const sightings = useMemo(() => {
        if (!filters.speciesFilter) return sightingsByText;
        return sightingsByText.filter(s => s.speciesCode === filters.speciesFilter);
    }, [sightingsByText, filters.speciesFilter]);

    // Top 10 species for the bar chart
    const speciesDistribution = useMemo(() => {
        const counts: Record<string, any> = {};

        sightingsByText.forEach((s) => {
            const code = s.speciesCode;
            if (!counts[code]) {
                counts[code] = {
                    name: s.comName,
                    code: code,
                    count: 0,
                    sightings: 0,
                };
            }
            counts[code].count += (s.howMany || 1);
            counts[code].sightings++;
        });

        // Convert to array and sort
        return Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((s) => ({
                ...s,
                fill: getBirdColor(s.code),
                isActive: filters.speciesFilter === s.code,
            }));
    }, [sightingsByText, filters.speciesFilter]);

    // Quick stats
    const stats = useMemo(() => {
        if (!sightingsByText.length) return { sightings: 0, species: 0, totalBirds: 0, locations: 0 };

        const species = new Set<string>();
        const locs = new Set<string>();
        let total = 0;

        sightingsByText.forEach(s => {
            species.add(s.speciesCode);
            locs.add(s.locName);
            total += (s.howMany || 1);
        });

        return {
            sightings: sightingsByText.length,
            species: species.size,
            totalBirds: total,
            locations: locs.size,
        };
    }, [sightingsByText]);

    const toggleSpeciesFilter = (code: string) => {
        setFilters((prev) => ({
            ...prev,
            speciesFilter: prev.speciesFilter === code ? null : code,
        }));
    };

    const clearSpeciesFilter = () => {
        setFilters((prev) => ({ ...prev, speciesFilter: null }));
    };

    const resetAllFilters = () => {
        setFilters({ searchText: "", speciesFilter: null });
        setSelectedSighting(null);
    };

    return {
        sightings,
        baseSightings: sightingsByText, // keeping alias
        allSightings: rawData || [],
        isLoading,
        error,
        filters,
        setFilters,
        stats,
        speciesDistribution,
        mapRef,
        selectedSighting,
        setSelectedSighting,
        toggleSpeciesFilter,
        clearSpeciesFilter,
        resetAllFilters,
        region,
        setRegion,
        refreshData: mutate,
    };
}
