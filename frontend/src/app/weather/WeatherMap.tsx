"use client";

import { useEffect } from "react";
import { MapWrapper, CircleMarker, Popup, useMap } from "@/components/maps/MapWrapper";
import { WeatherStation } from "@/types";
import { getTemperatureColor, getWeatherDescription } from "@/hooks/useWeatherStations";

interface WeatherMapProps {
    stations: WeatherStation[];
    onStationClick: (station: WeatherStation) => void;
    mapRef: React.MutableRefObject<L.Map | null>;
    selectedStation: WeatherStation | null;
}

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;
    }, [map, mapRef]);

    return null;
}

function FlyToHandler({ selectedStation }: { selectedStation: WeatherStation | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedStation) {
            map.flyTo([selectedStation.latitude, selectedStation.longitude], 8, { duration: 0.8 });
        }
    }, [selectedStation, map]);

    return null;
}

export default function WeatherMap({
    stations,
    onStationClick,
    mapRef,
    selectedStation,
}: WeatherMapProps) {
    return (
        <MapWrapper center={[50, 10]} zoom={4}>
            <MapRefCapture mapRef={mapRef} />
            <FlyToHandler selectedStation={selectedStation} />

            {stations.map((station, index) => {
                const temp = station.temperature;
                const color = getTemperatureColor(temp ?? NaN);
                const weather = getWeatherDescription(station.weatherCode ?? -1);
                const isSelected = selectedStation?.id === station.id;

                return (
                    <CircleMarker
                        key={`${station.id}-${index}`}
                        center={[station.latitude, station.longitude]}
                        radius={isSelected ? 10 : 6}
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
                                    ID: {station.id}
                                </p>

                                {temp !== undefined && !isNaN(temp) && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: color }}>
                                            {temp.toFixed(1)}°C {weather.icon}
                                        </p>
                                        <p style={{ color: '#555', fontSize: '11px' }}>
                                            {weather.description}
                                        </p>
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: '#555' }}>
                                    {station.humidity !== undefined && !isNaN(station.humidity) && (
                                        <p>💧 {station.humidity.toFixed(0)}%</p>
                                    )}
                                    {station.windSpeed !== undefined && !isNaN(station.windSpeed) && (
                                        <p>💨 {station.windSpeed.toFixed(1)} km/h</p>
                                    )}
                                    <p>📍 {station.elevation} {station.elevationUnit || "m"}</p>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapWrapper>
    );
}
