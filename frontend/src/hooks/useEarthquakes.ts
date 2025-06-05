"use client";

import useSWR from "swr";
import { useMemo, useState, useRef, useEffect } from "react";

import { Earthquake } from "@/types";
import { API_BASE, fetcher } from "@/lib/api";

export interface EarthquakeFilters {
    magnitudeMin: number;
    magnitudeMax: number;
    startDate: string;
    endDate: string;
    searchText: string;
    magnitudeRangeFilter: { min: number; max: number; label: string } | null;
}

// Simple helper for default dates (Last 12 months)
function getDefaultDates() {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    return {
        startDate: lastYear.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
    };
}

export function useEarthquakes() {
    const defaults = getDefaultDates();
    const mapRef = useRef<L.Map | null>(null);

    const { data, error, isLoading } = useSWR<Earthquake[]>(
        `${API_BASE}/mapdata?limit=2000`,
        fetcher,
        { revalidateOnFocus: false }
    );

    // We only care about Europe for this dashboard view
    const europeData = useMemo(() => {
        if (!data) return [];
        return data.filter((eq) =>
            eq.latitude >= 30 && eq.latitude <= 75 &&
            eq.longitude >= -30 && eq.longitude <= 45
        );
    }, [data]);

    // Calculate min/max magnitude for the sliders
    const magnitudeRange = useMemo(() => {
        if (!europeData.length) return { min: 0, max: 6 };

        const mags = europeData.map(e => e.magnitude);
        return {
            min: Math.max(0, Math.min(...mags)),
            max: Math.max(...mags)
        };
    }, [europeData]);

    const [filters, setFilters] = useState<EarthquakeFilters>({
        magnitudeMin: 0,
        magnitudeMax: 10,
        startDate: defaults.startDate,
        endDate: defaults.endDate,
        searchText: "",
        magnitudeRangeFilter: null,
    });

    // Auto-update filter range once data loads
    const [sliderInitialized, setSliderInitialized] = useState(false);
    useEffect(() => {
        if (europeData.length > 0 && !sliderInitialized) {
            setFilters(prev => ({
                ...prev,
                magnitudeMin: magnitudeRange.min,
                magnitudeMax: magnitudeRange.max,
            }));
            setSliderInitialized(true);
        }
    }, [europeData.length, magnitudeRange, sliderInitialized]);

    const baseFilteredData = useMemo(() => {
        if (!europeData.length) return [];

        const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
        // include the full end date
        const end = filters.endDate ? new Date(filters.endDate).getTime() + 86400000 : Infinity;

        const { magnitudeMin: minMag, magnitudeMax: maxMag, searchText } = filters;
        const search = searchText.toLowerCase();

        return europeData.filter((eq) => {
            if (eq.magnitude < minMag || eq.magnitude > maxMag) return false;

            const t = Date.parse(eq.date);
            if (!isNaN(t) && (t < start || t > end)) return false;

            if (search && !eq.location?.toLowerCase().includes(search)) return false;

            return true;
        });
    }, [europeData, filters.magnitudeMin, filters.magnitudeMax, filters.startDate, filters.endDate, filters.searchText]);

    // Secondary filter for the interactive bar chart
    const filteredData = useMemo(() => {
        if (!filters.magnitudeRangeFilter) return baseFilteredData;
        const { min, max } = filters.magnitudeRangeFilter;
        return baseFilteredData.filter((eq) => eq.magnitude >= min && eq.magnitude < max);
    }, [baseFilteredData, filters.magnitudeRangeFilter]);

    // Helper for histogram coloring
    // Just a simple interpolated gradient-ish approach for now
    const getGradientColor = (val: number) => {
        if (val < 1.0) return "hsl(280, 80%, 60%)";
        if (val < 2.0) return "hsl(200, 90%, 50%)";
        if (val < 3.0) return "hsl(160, 80%, 40%)";
        if (val < 4.0) return "hsl(80, 80%, 45%)";
        if (val < 5.0) return "hsl(25, 95%, 50%)";
        return "hsl(0, 90%, 55%)";
    };

    const magnitudeDistribution = useMemo(() => {
        if (!baseFilteredData.length) {
            return { labels: [], bins: [], colors: [], ranges: [] };
        }

        // Standard fixed bins are better than dynamic merging
        // 0-1, 1-2, 2-3... up to max
        const binSize = 0.5;
        const maxMag = Math.ceil(Math.max(...baseFilteredData.map(e => e.magnitude)));
        const bins: { min: number; max: number; count: number; label: string }[] = [];

        for (let m = 0; m < maxMag; m += binSize) {
            bins.push({
                min: m,
                max: m + binSize,
                count: 0,
                label: `${m.toFixed(1)}-${(m + binSize).toFixed(1)}`
            });
        }

        baseFilteredData.forEach(eq => {
            const idx = Math.floor(eq.magnitude / binSize);
            if (bins[idx]) bins[idx].count++;
        });

        // Filter out empty tail bins if we want, but keeping them shows scale
        // Ideally just return the bins that have data or are in range
        const validBins = bins.filter(b => b.min >= magnitudeRange.min && b.min <= magnitudeRange.max + 0.5);

        return {
            labels: validBins.map(b => b.label),
            bins: validBins.map(b => b.count),
            colors: validBins.map(b => getGradientColor((b.min + b.max) / 2)),
            ranges: validBins.map(b => ({ min: b.min, max: b.max, label: b.label }))
        };
    }, [baseFilteredData, magnitudeRange]);

    const flyToEarthquake = (eq: Earthquake) => {
        if (mapRef.current) {
            mapRef.current.flyTo([eq.latitude, eq.longitude], 10, { duration: 1 });
        }
    };

    const toggleMagnitudeFilter = (range: { min: number; max: number; label: string }) => {
        setFilters((prev) => ({
            ...prev,
            magnitudeRangeFilter:
                prev.magnitudeRangeFilter?.label === range.label ? null : range,
        }));
    };

    const clearMagnitudeFilter = () => {
        setFilters((prev) => ({ ...prev, magnitudeRangeFilter: null }));
    };

    const resetAllFilters = () => {
        setFilters({
            magnitudeMin: magnitudeRange.min,
            magnitudeMax: magnitudeRange.max,
            startDate: defaults.startDate,
            endDate: defaults.endDate,
            searchText: "",
            magnitudeRangeFilter: null,
        });
    };

    return {
        earthquakes: filteredData,
        baseEarthquakes: baseFilteredData,
        allEarthquakes: europeData,
        isLoading,
        error,
        filters,
        setFilters,
        magnitudeDistribution,
        magnitudeRange,
        mapRef,
        flyToEarthquake,
        toggleMagnitudeFilter,
        clearMagnitudeFilter,
        resetAllFilters,
    };
}
