import React from "react";

export const depthLegend = [
    { label: "<5km", color: "#ff4444" },
    { label: "5-10km", color: "#ff8844" },
    { label: "10-20km", color: "#ffcc44" },
    { label: "20-50km", color: "#44cc88" },
    { label: ">50km", color: "#4488cc" },
];

export function EarthquakeLegend() {
    return (
        <div>
            <p className="text-[10px] text-muted-foreground mb-1">Ring Color = Depth</p>
            <div className="flex gap-1">
                {depthLegend.map((d) => (
                    <div key={d.label} className="flex items-center gap-1 flex-1">
                        <span
                            className="w-2.5 h-2.5 rounded-full border-2"
                            style={{ borderColor: d.color, backgroundColor: 'transparent' }}
                        />
                        <span className="text-[9px] text-muted-foreground">{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
