"use client";

import useSWR from "swr";
import { useMemo, useState, useRef } from "react";

import { AirQualityStation, Pollutant, AQILevel } from "@/types";
import { API_BASE, fetcher } from "@/lib/api";

export const AQI_COLORS: Record<AQILevel, string> = {
    good: "#00e400",
    moderate: "#ffff00",
    unhealthySensitive: "#ff7e00",
    unhealthy: "#ff0000",
    veryUnhealthy: "#99004c",
    hazardous: "#7e0023",
};

export const AQI_LABELS: Record<AQILevel, string> = {
    good: "Good",
    moderate: "Moderate",
    unhealthySensitive: "Unhealthy (Sens.)",
    unhealthy: "Unhealthy",
    veryUnhealthy: "Very Unhealthy",
    hazardous: "Hazardous",
};

export interface AirQualityFilters {
    pollutant: Pollutant;
    searchText: string;
    activeFilter: AQILevel | null; // was aqiLevelFilter
}

export function getPollutantValue(station: AirQualityStation, pollutant: Pollutant): number {
    // simple lookup is fine here
    return station[pollutant] ?? -1;
}

// much cleaner threshold lookup
const AQI_THRESHOLDS = {
    pm25: [12, 35.4, 55.4, 150.4, 250.4],
    pm10: [54, 154, 254, 354, 424],
    no2: [53, 100, 360, 649, 1249],
    o3: [54, 70, 85, 105, 200],
    default: [50, 100, 150, 200, 300]
};

const LEVELS: AQILevel[] = ["good", "moderate", "unhealthySensitive", "unhealthy", "veryUnhealthy", "hazardous"];

export function getAQILevel(value: number, pollutant: Pollutant): AQILevel {
    const thresholds = AQI_THRESHOLDS[pollutant as keyof typeof AQI_THRESHOLDS] || AQI_THRESHOLDS.default;

    // find the first threshold that value is less than or equal to
    const idx = thresholds.findIndex(t => value <= t);
    return idx === -1 ? "hazardous" : LEVELS[idx];
}

export function useAirQuality() {
    const mapRef = useRef<L.Map | null>(null);

    const [filters, setFilters] = useState<AirQualityFilters>({
        pollutant: "pm25",
        searchText: "",
        activeFilter: null,
    });

    const [selectedStation, setSelectedStation] = useState<AirQualityStation | null>(null);

    const { data: rawData, error, isLoading } = useSWR<AirQualityStation[]>(
        `${API_BASE}/airqualitydata`,
        fetcher,
        { revalidateOnFocus: false }
    );

    // Filter by text first
    const allStations = useMemo(() => {
        if (!rawData) return [];

        const search = filters.searchText.toLowerCase().trim();

        return rawData.filter((s) => {
            const val = getPollutantValue(s, filters.pollutant);
            if (val < 0) return false; // skip invalid

            if (!search) return true;

            return (s.name?.toLowerCase().includes(search) ||
                s.city?.toLowerCase().includes(search));
        });
    }, [rawData, filters.pollutant, filters.searchText]);

    // Apply active AQI filter
    const stations = useMemo(() => {
        if (!filters.activeFilter) return allStations;

        return allStations.filter((s) => {
            const val = getPollutantValue(s, filters.pollutant);
            return getAQILevel(val, filters.pollutant) === filters.activeFilter;
        });
    }, [allStations, filters.activeFilter, filters.pollutant]);

    // Calculate stats for the chart/legend
    const distribution = useMemo(() => {
        // init counts
        const counts: Record<string, number> = {};
        LEVELS.forEach(l => counts[l] = 0);

        allStations.forEach(s => {
            const val = getPollutantValue(s, filters.pollutant);
            const level = getAQILevel(val, filters.pollutant);
            counts[level] = (counts[level] || 0) + 1;
        });

        return LEVELS.map(level => ({
            name: AQI_LABELS[level],
            level,
            count: counts[level],
            fill: AQI_COLORS[level],
            isActive: filters.activeFilter === level,
        }));
    }, [allStations, filters.pollutant, filters.activeFilter]);

    // Quick summary helper
    const summary = useMemo(() => {
        // just map the distribution to match the old interface if needed, or simplify usage
        // usage seems to use { good: x, moderate: y, unhealthy: z }
        // let's just do a naive reduce
        const s = { good: 0, moderate: 0, unhealthy: 0, total: 0 };

        allStations.forEach(station => {
            const val = getPollutantValue(station, filters.pollutant);
            const level = getAQILevel(val, filters.pollutant);

            s.total++;
            if (level === 'good') s.good++;
            else if (level === 'moderate') s.moderate++;
            else s.unhealthy++;
        });
        return s;
    }, [allStations, filters.pollutant]);


    // Handlers
    const toggleAqiFilter = (level: AQILevel) => {
        setFilters(prev => ({
            ...prev,
            activeFilter: prev.activeFilter === level ? null : level
        }));
    };

    const clearAqiFilter = () => setFilters(p => ({ ...p, activeFilter: null }));

    const resetAllFilters = () => {
        setFilters(prev => ({
            ...prev,
            searchText: "",
            activeFilter: null
        }));
        setSelectedStation(null);
    };

    const setPollutant = (p: Pollutant) => {
        setFilters(prev => ({ ...prev, pollutant: p, activeFilter: null })); // reset filter when changing pollutant usually
        setSelectedStation(null);
    };

    return {
        stations,
        baseStations: allStations, // keeping alias for compat
        isLoading,
        error,
        filters,
        setFilters,
        summary,
        distribution,
        selectedStation,
        setSelectedStation,
        mapRef,
        toggleAqiFilter,
        clearAqiFilter,
        resetAllFilters,
        setPollutant,
    };
}
