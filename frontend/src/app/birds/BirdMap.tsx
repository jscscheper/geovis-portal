"use client";

import { useEffect } from "react";
import { MapWrapper, CircleMarker, Popup, useMap } from "@/components/maps/MapWrapper";
import { getBirdColor } from "@/hooks/useBirdSightings";
import { BirdSighting } from "@/types";

interface BirdMapProps {
    sightings: BirdSighting[];
    onSightingClick: (sighting: BirdSighting) => void;
    mapRef: React.MutableRefObject<L.Map | null>;
    selectedSighting: BirdSighting | null;
}

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    return null;
}

function FlyToHandler({ selectedSighting }: { selectedSighting: BirdSighting | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedSighting) {
            map.flyTo([selectedSighting.lat, selectedSighting.lng], 12, { duration: 0.8 });
        }
    }, [selectedSighting, map]);

    return null;
}

export default function BirdMap({
    sightings,
    onSightingClick,
    mapRef,
    selectedSighting,
}: BirdMapProps) {
    return (
        <MapWrapper center={[52.1326, 5.2913]} zoom={8}>
            <MapRefCapture mapRef={mapRef} />
            <FlyToHandler selectedSighting={selectedSighting} />

            {sightings.map((sighting, index) => {
                const color = getBirdColor(sighting.speciesCode);
                const isSelected =
                    selectedSighting?.speciesCode === sighting.speciesCode &&
                    selectedSighting?.lat === sighting.lat &&
                    selectedSighting?.lng === sighting.lng;

                return (
                    <CircleMarker
                        key={`${sighting.speciesCode}-${sighting.lat}-${sighting.lng}-${index}`}
                        center={[sighting.lat, sighting.lng]}
                        radius={isSelected ? 10 : 6}
                        pathOptions={{
                            color: isSelected ? "#fff" : color,
                            fillColor: color,
                            fillOpacity: 0.8,
                            weight: isSelected ? 3 : 2,
                        }}
                        eventHandlers={{
                            click: () => onSightingClick(sighting),
                        }}
                    >
                        <Popup>
                            <div
                                className="text-sm min-w-[200px]"
                                style={{
                                    color: "#1a1a1a",
                                    backgroundColor: "#ffffff",
                                    padding: "8px",
                                    borderRadius: "6px",
                                }}
                            >
                                <p style={{ fontWeight: 600, marginBottom: "2px", color: "#111" }}>
                                    {sighting.comName}
                                </p>
                                <p style={{ color: "#666", fontSize: "11px", fontStyle: "italic", marginBottom: "8px" }}>
                                    {sighting.sciName}
                                </p>

                                <div style={{ fontSize: "12px", color: "#444" }}>
                                    {sighting.howMany > 0 && (
                                        <p>Count: {sighting.howMany}</p>
                                    )}
                                    <p>{sighting.locName}</p>
                                    <p>{sighting.obsDt}</p>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapWrapper>
    );
}
