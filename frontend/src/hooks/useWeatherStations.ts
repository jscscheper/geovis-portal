"use client";

import useSWR from "swr";
import { useMemo, useState, useRef } from "react";
import { WeatherStation } from "@/types";
import { API_BASE, fetcher } from "@/lib/api";

export type WeatherIconType = "sun" | "cloud-sun" | "cloud" | "fog" | "rain" | "snow" | "snowflake" | "storm" | "unknown";

// Map WMO codes to our internal icons/descriptions
export const WEATHER_CODES: Record<number, { description: string; icon: WeatherIconType }> = {
    0: { description: "Clear sky", icon: "sun" },
    1: { description: "Mainly clear", icon: "cloud-sun" },
    2: { description: "Partly cloudy", icon: "cloud-sun" },
    3: { description: "Overcast", icon: "cloud" },
    45: { description: "Fog", icon: "fog" },
    48: { description: "Depositing rime fog", icon: "fog" },
    51: { description: "Light drizzle", icon: "rain" },
    53: { description: "Moderate drizzle", icon: "rain" },
    55: { description: "Dense drizzle", icon: "rain" },
    61: { description: "Slight rain", icon: "rain" },
    63: { description: "Moderate rain", icon: "rain" },
    65: { description: "Heavy rain", icon: "rain" },
    71: { description: "Slight snow", icon: "snow" },
    73: { description: "Moderate snow", icon: "snow" },
    75: { description: "Heavy snow", icon: "snowflake" },
    80: { description: "Slight rain showers", icon: "rain" },
    81: { description: "Moderate rain showers", icon: "rain" },
    82: { description: "Violent rain showers", icon: "storm" },
    95: { description: "Thunderstorm", icon: "storm" },
    96: { description: "Thunderstorm with hail", icon: "storm" },
    99: { description: "Thunderstorm with heavy hail", icon: "storm" },
};

export function getWeatherDescription(code: number) {
    return WEATHER_CODES[code] || { description: "Unknown", icon: "unknown" };
}

// Simple heat map colors for temp
export function getTemperatureColor(temp: number): string {
    if (isNaN(temp)) return "#888"; // fallback gray
    if (temp <= 0) return "#00bfff"; // freezing
    if (temp <= 10) return "#4fc3f7"; // cold
    if (temp <= 20) return "#4caf50"; // mild
    if (temp <= 30) return "#ff9800"; // warm
    return "#f44336"; // hot
}

export const WEATHER_REGIONS = [
    { code: "all", name: "All Stations", center: [50.0, 10.0] as [number, number], zoom: 4 },
    { code: "NL", name: "Netherlands", center: [52.1326, 5.2913] as [number, number], zoom: 7 },
    { code: "DE", name: "Germany", center: [51.1657, 10.4515] as [number, number], zoom: 6 },
    { code: "GB", name: "United Kingdom", center: [54.0, -2.0] as [number, number], zoom: 6 },
    { code: "FR", name: "France", center: [46.6034, 2.3488] as [number, number], zoom: 6 },
    { code: "ES", name: "Spain", center: [40.4168, -3.7038] as [number, number], zoom: 6 },
    { code: "IT", name: "Italy", center: [42.5, 12.5] as [number, number], zoom: 6 },
    { code: "PL", name: "Poland", center: [52.0, 19.0] as [number, number], zoom: 6 },
    { code: "SE", name: "Sweden", center: [62.0, 15.0] as [number, number], zoom: 5 },
    { code: "NO", name: "Norway", center: [64.0, 10.0] as [number, number], zoom: 5 },
] as const;

export type WeatherRegionCode = typeof WEATHER_REGIONS[number]["code"];

export interface WeatherFilters {
    searchText: string;
    tempFilter: { name: string; min: number; max: number; color: string } | null;
}

const TEMP_RANGES = [
    { name: "≤0°C", min: -100, max: 0, color: "#00bfff" },
    { name: "1-10°C", min: 1, max: 10, color: "#4fc3f7" },
    { name: "11-20°C", min: 11, max: 20, color: "#4caf50" },
    { name: "21-30°C", min: 21, max: 30, color: "#ff9800" },
    { name: ">30°C", min: 31, max: 100, color: "#f44336" },
];

export function useWeatherStations() {
    const mapRef = useRef<L.Map | null>(null);

    const [region, setRegion] = useState<WeatherRegionCode>("all");

    const [filters, setFilters] = useState<WeatherFilters>({
        searchText: "",
        tempFilter: null,
    });

    const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(null);

    const { data: rawData, error, isLoading } = useSWR<WeatherStation[]>(
        region === "all" ? `${API_BASE}/weatherdata?nstations=100` : `${API_BASE}/weatherdata?country=${region}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    // Filter by search text
    const allStations = useMemo(() => {
        if (!rawData) return [];
        if (!filters.searchText) return rawData;

        const search = filters.searchText.toLowerCase();
        return rawData.filter((s) =>
            s.name?.toLowerCase().includes(search) ||
            s.id?.toLowerCase().includes(search)
        );
    }, [rawData, filters.searchText]);

    // Apply active temp filter
    const stations = useMemo(() => {
        if (!filters.tempFilter) return allStations;
        const { min, max } = filters.tempFilter;

        return allStations.filter((s) => {
            if (typeof s.temperature !== 'number' || isNaN(s.temperature)) return false;
            return s.temperature >= min && s.temperature <= max;
        });
    }, [allStations, filters.tempFilter]);

    // Calculate quick stats
    const stats = useMemo(() => {
        if (!allStations.length) return { min: 0, max: 0, avg: 0, count: 0 };

        const temps = allStations
            .map(s => s.temperature)
            .filter((t): t is number => typeof t === 'number' && !isNaN(t));

        if (!temps.length) return { min: 0, max: 0, avg: 0, count: 0 };

        const sum = temps.reduce((a, b) => a + b, 0);

        return {
            min: Math.min(...temps),
            max: Math.max(...temps),
            avg: sum / temps.length,
            count: allStations.length,
        };
    }, [allStations]);

    // Distribution for the bar chart
    const distribution = useMemo(() => {
        return TEMP_RANGES.map(range => ({
            name: range.name,
            min: range.min,
            max: range.max,
            color: range.color,
            count: allStations.filter(s => {
                const t = s.temperature;
                return typeof t === 'number' && !isNaN(t) && t >= range.min && t <= range.max;
            }).length,
            fill: range.color,
            isActive: filters.tempFilter?.name === range.name,
        }));
    }, [allStations, filters.tempFilter]);

    const toggleTempFilter = (range: typeof TEMP_RANGES[0]) => {
        setFilters((prev) => ({
            ...prev,
            tempFilter: prev.tempFilter?.name === range.name ? null : range,
        }));
    };

    const clearTempFilter = () => {
        setFilters((prev) => ({ ...prev, tempFilter: null }));
    };

    const resetAllFilters = () => {
        setFilters({ searchText: "", tempFilter: null });
        setSelectedStation(null);
    };

    return {
        stations,
        baseStations: allStations, // alias compat
        allStations: rawData || [],
        isLoading,
        error,
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
    };
}
