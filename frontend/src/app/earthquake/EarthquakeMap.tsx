"use client";

import { useEffect } from "react";
import { MapWrapper, CircleMarker, Popup, useMap } from "@/components/maps/MapWrapper";
import type { Earthquake } from "@/types";

interface EarthquakeMapProps {
    earthquakes: Earthquake[];
    distribution: {
        ranges?: { min: number; max: number; label: string }[];
        colors: string[];
    };
    mapRef: React.MutableRefObject<L.Map | null>;
    selectedEarthquake: Earthquake | null;
}

function getMarkerColor(
    magnitude: number,
    distribution: EarthquakeMapProps["distribution"]
): string {
    const { ranges, colors } = distribution;

    if (!ranges || colors.length === 0) return "#4bc0c0";

    for (let i = 0; i < ranges.length; i++) {
        if (magnitude >= ranges[i].min && magnitude < ranges[i].max) {
            return colors[i] || "#4bc0c0";
        }
    }

    return colors[colors.length - 1] || "#4bc0c0";
}

function getDepthColor(depth: number): string {
    if (depth < 5) return "#ff4444";
    if (depth < 10) return "#ff8844";
    if (depth < 20) return "#ffcc44";
    if (depth < 50) return "#44cc88";
    if (depth < 100) return "#4488cc";
    return "#6644aa";
}

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    return null;
}

function FlyToHandler({ selectedEarthquake }: { selectedEarthquake: Earthquake | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedEarthquake) {
            const lat = selectedEarthquake.latitude;
            const lon = selectedEarthquake.longitude;
            map.flyTo([lat, lon], 10, { duration: 0.8 });
        }
    }, [selectedEarthquake, map]);

    return null;
}

export default function EarthquakeMap({
    earthquakes,
    distribution,
    mapRef,
    selectedEarthquake,
}: EarthquakeMapProps) {
    return (
        <MapWrapper center={[52.1326, 5.2913]} zoom={6}>
            <MapRefCapture mapRef={mapRef} />
            <FlyToHandler selectedEarthquake={selectedEarthquake} />

            {earthquakes.map((eq, index) => {
                const lat = eq.latitude;
                const lon = eq.longitude;
                const magColor = getMarkerColor(eq.magnitude, distribution);
                const depthColor = getDepthColor(eq.depth);
                const radius = 4 + eq.magnitude * 1.5;
                const isSelected = selectedEarthquake?.date === eq.date &&
                    selectedEarthquake?.location === eq.location;

                return (
                    <CircleMarker
                        key={`${eq.date}-${index}`}
                        center={[lat, lon]}
                        radius={isSelected ? radius * 1.5 : radius}
                        pathOptions={{
                            color: isSelected ? "#fff" : depthColor,
                            fillColor: magColor,
                            fillOpacity: 0.8,
                            weight: isSelected ? 3 : 2,
                        }}
                    >
                        <Popup>
                            <div
                                className="text-sm min-w-[180px]"
                                style={{
                                    color: '#1a1a1a',
                                    backgroundColor: '#ffffff',
                                    padding: '8px',
                                    borderRadius: '6px',
                                }}
                            >
                                <p style={{ fontWeight: 600, marginBottom: '4px', color: '#111' }}>
                                    {eq.location}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>Magnitude:</strong> {eq.magnitude.toFixed(1)}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>Depth:</strong> {eq.depth.toFixed(1)} km
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>Date:</strong> {new Date(eq.date).toLocaleDateString()}
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapWrapper>
    );
}
