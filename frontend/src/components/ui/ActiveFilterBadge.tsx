"use client";

import { Activity, X } from "lucide-react";

interface ActiveFilterBadgeProps {
    label: string;
    description: string;
    color: string;
    onClear: () => void;
}

export function ActiveFilterBadge({
    label,
    description,
    color,
    onClear,
}: ActiveFilterBadgeProps) {
    return (
        <div
            className="flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all hover:opacity-80 bg-card/80 backdrop-blur-md"
            style={{
                background: `linear-gradient(90deg, ${color}20, transparent)`,
                borderLeft: `3px solid ${color}`,
            }}
            onClick={onClear}
        >
            <Activity className="w-4 h-4" style={{ color }} />
            <div className="flex-1">
                <p className="text-xs font-medium">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
            </div>
            <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
        </div>
    );
}
