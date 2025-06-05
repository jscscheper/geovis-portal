"use client";

import { useState, useCallback } from "react";

import { BenchmarkResult, BenchmarkTest } from "@/types";
import { API_BASE } from "@/lib/api";

export interface APIEndpoint {
    name: string;
    path: string;
    description: string;
}

const ENDPOINTS: APIEndpoint[] = [
    { name: "Earthquakes", path: "/mapdata?limit=100", description: "Fetch earthquake data" },
    { name: "Air Quality", path: "/airqualitydata", description: "Fetch air quality station data" },
    { name: "Weather", path: "/weatherdata", description: "Fetch weather station data" },
];

export function useBenchmark() {
    const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>(
        ENDPOINTS.map(e => e.name)
    );
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [runningTests, setRunningTests] = useState<BenchmarkTest[]>([]);
    const [results, setResults] = useState<BenchmarkResult[]>([]);

    const toggleEndpoint = useCallback((name: string) => {
        setSelectedEndpoints(prev =>
            prev.includes(name)
                ? prev.filter(e => e !== name)
                : [...prev, name]
        );
    }, []);

    const benchmarkEndpoint = async (endpoint: APIEndpoint): Promise<BenchmarkResult> => {
        const startTime = performance.now();

        try {
            const response = await fetch(`${API_BASE}${endpoint.path}`);
            const endTime = performance.now();
            const data = await response.text();

            return {
                endpoint: endpoint.name,
                responseTime: Math.round(endTime - startTime),
                status: response.ok ? "success" : "error",
                statusCode: response.status,
                dataSize: new Blob([data]).size,
            };
        } catch (error) {
            const endTime = performance.now();
            return {
                endpoint: endpoint.name,
                responseTime: Math.round(endTime - startTime),
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    };

    const startBenchmark = useCallback(async () => {
        const endpointsToTest = ENDPOINTS.filter(e => selectedEndpoints.includes(e.name));

        if (endpointsToTest.length === 0) return;

        setIsRunning(true);
        setIsFinished(false);
        setResults([]);
        setRunningTests(endpointsToTest.map(e => ({ endpoint: e.name, status: "pending" })));

        const newResults: BenchmarkResult[] = [];

        for (const endpoint of endpointsToTest) {
            setRunningTests(prev =>
                prev.map(t =>
                    t.endpoint === endpoint.name ? { ...t, status: "running" } : t
                )
            );

            const result = await benchmarkEndpoint(endpoint);
            newResults.push(result);

            setRunningTests(prev =>
                prev.map(t =>
                    t.endpoint === endpoint.name
                        ? { ...t, status: result.status === "success" ? "done" : "error" }
                        : t
                )
            );

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        setResults(newResults);
        setIsRunning(false);
        setIsFinished(true);
    }, [selectedEndpoints]);

    const resetBenchmark = useCallback(() => {
        setIsFinished(false);
        setResults([]);
        setRunningTests([]);
    }, []);

    return {
        endpoints: ENDPOINTS,
        selectedEndpoints,
        toggleEndpoint,
        startBenchmark,
        resetBenchmark,
        isRunning,
        isFinished,
        runningTests,
        results,
    };
}
