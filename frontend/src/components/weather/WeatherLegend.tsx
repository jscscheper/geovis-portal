export const tempLegend = [
    { label: "≤0°C (Freezing)", color: "#00bfff" },
    { label: "1-10°C (Cold)", color: "#4fc3f7" },
    { label: "11-20°C (Mild)", color: "#4caf50" },
    { label: "21-30°C (Warm)", color: "#ff9800" },
    { label: ">30°C (Hot)", color: "#f44336" },
];

export function WeatherLegend() {
    return (
        <div className="space-y-1">
            {tempLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
