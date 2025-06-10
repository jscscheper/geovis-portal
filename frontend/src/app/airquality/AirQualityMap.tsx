"use client";

import { useEffect } from "react";
import { MapWrapper, CircleMarker, Popup, useMap } from "@/components/maps/MapWrapper";
import { AirQualityStation, Pollutant } from "@/types";
import {
    getPollutantValue,
    getAQILevel,
    AQI_COLORS,
} from "@/hooks/useAirQuality";

interface AirQualityMapProps {
    stations: AirQualityStation[];
    pollutant: Pollutant;
    onStationClick: (station: AirQualityStation) => void;
    mapRef: React.MutableRefObject<L.Map | null>;
    selectedStation: AirQualityStation | null;
}

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    return null;
}

function FlyToHandler({ selectedStation }: { selectedStation: AirQualityStation | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedStation) {
            const lat = parseFloat(selectedStation.latLon[0]);
            const lon = parseFloat(selectedStation.latLon[1]);
            map.flyTo([lat, lon], 10, { duration: 0.8 });
        }
    }, [selectedStation, map]);

    return null;
}

export default function AirQualityMap({
    stations,
    pollutant,
    onStationClick,
    mapRef,
    selectedStation,
}: AirQualityMapProps) {
    return (
        <MapWrapper center={[50.5, 10]} zoom={4}>
            <MapRefCapture mapRef={mapRef} />
            <FlyToHandler selectedStation={selectedStation} />

            {stations.map((station, index) => {
                const lat = parseFloat(station.latLon[0]);
                const lon = parseFloat(station.latLon[1]);
                const value = getPollutantValue(station, pollutant);
                const level = getAQILevel(value, pollutant);
                const color = AQI_COLORS[level];
                const isSelected = selectedStation?.name === station.name &&
                    selectedStation?.latLon[0] === station.latLon[0];

                return (
                    <CircleMarker
                        key={`${station.name}-${index}`}
                        center={[lat, lon]}
                        radius={isSelected ? 12 : 8}
                        pathOptions={{
                            color: isSelected ? "#fff" : color,
                            fillColor: color,
                            fillOpacity: 0.8,
                            weight: isSelected ? 3 : 2,
                        }}
                        eventHandlers={{
                            click: () => onStationClick(station),
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
                                    {station.name}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px', marginBottom: '8px' }}>
                                    {station.city}, {station.country}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>PM2.5:</strong>{" "}
                                    {station.pm25 >= 0 ? `${station.pm25.toFixed(1)} µg/m³` : "N/A"}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>PM10:</strong>{" "}
                                    {station.pm10 >= 0 ? `${station.pm10.toFixed(1)} µg/m³` : "N/A"}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>NO₂:</strong>{" "}
                                    {station.no2 >= 0 ? `${station.no2.toFixed(1)} µg/m³` : "N/A"}
                                </p>
                                <p style={{ color: '#555', fontSize: '12px' }}>
                                    <strong>O₃:</strong>{" "}
                                    {station.o3 >= 0 ? `${station.o3.toFixed(1)} µg/m³` : "N/A"}
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapWrapper>
    );
}
