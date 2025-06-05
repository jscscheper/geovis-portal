"use client";

import { Globe } from "lucide-react";

interface Region {
    code: string;
    name: string;
    center: [number, number];
    zoom: number;
}

interface RegionSelectorProps {
    regions: readonly Region[];
    value: string;
    onChange: (regionCode: string) => void;
    mapRef: React.MutableRefObject<L.Map | null>;
}

export function RegionSelector({
    regions,
    value,
    onChange,
    mapRef,
}: RegionSelectorProps) {
    const handleChange = (newRegion: string) => {
        onChange(newRegion);
        const regionConfig = regions.find((r) => r.code === newRegion);
        if (regionConfig && mapRef.current) {
            mapRef.current.flyTo(regionConfig.center, regionConfig.zoom, { duration: 1 });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="flex-1 h-8 px-2 rounded-md bg-background/50 border border-border text-sm"
            >
                {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                        {r.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
