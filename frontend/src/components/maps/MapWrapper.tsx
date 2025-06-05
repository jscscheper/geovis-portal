"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

interface MapWrapperProps {
    center?: LatLngExpression;
    zoom?: number;
    children?: React.ReactNode;
}

function MapResizer() {
    const map = useMap();

    useEffect(() => {
        const handleResize = () => {
            map.invalidateSize();
        };
        const timer = setTimeout(() => map.invalidateSize(), 500);
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, [map]);

    return null;
}

export function MapWrapper({
    center = [52.1326, 5.2913],
    zoom = 6,
    children
}: MapWrapperProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [map, setMap] = useState<LeafletMap | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (map) {
            const checkPanesReady = () => {
                try {
                    const tilePane = map.getPane('tilePane');
                    const markerPane = map.getPane('markerPane');
                    const mapPane = map.getPane('mapPane');
                    return tilePane && markerPane && mapPane;
                } catch {
                    return false;
                }
            };

            const checkAndSetReady = () => {
                if (checkPanesReady()) {
                    setMapReady(true);
                } else {
                    setTimeout(checkAndSetReady, 50);
                }
            };

            const timer = setTimeout(checkAndSetReady, 20);
            return () => clearTimeout(timer);
        } else {
            setMapReady(false);
        }
    }, [map]);

    if (!isMounted) {
        return (
            <div
                className="h-full w-full flex items-center justify-center bg-zinc-900"
            >
                <p className="text-zinc-500">Loading map...</p>
            </div>
        );
    }

    return (
        <MapContainer
            ref={setMap}
            center={center}
            zoom={zoom}
            zoomControl={false}
            className="h-full w-full"
            style={{ background: "#1a1a1a" }}
        >
            {mapReady && (
                <>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        subdomains="abcd"
                        maxZoom={19}
                    />
                    <MapResizer />
                    {children}
                </>
            )}
        </MapContainer>
    );
}

export { CircleMarker, Popup, useMap };
