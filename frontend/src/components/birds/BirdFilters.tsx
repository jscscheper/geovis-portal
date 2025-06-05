import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bird } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BirdFilters as FilterConfig, REGIONS } from "@/hooks/useBirdSightings";

interface Props {
    config: FilterConfig;
    onChange: (config: FilterConfig) => void;
    region: string;
    onRegionChange: (region: any) => void;
}

export function BirdFilters({ config, onChange, region, onRegionChange }: Props) {
    return (
        <Card className="bg-card/90 backdrop-blur border-border/50 p-3 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Bird className="w-4 h-4 text-green-400" />
                <span className="font-medium text-sm">Bird Sightings</span>
            </div>

            <Input
                placeholder="Search species..."
                value={config.searchText}
                onChange={(e) => onChange({ ...config, searchText: e.target.value })}
                className="bg-background/50 h-7 text-xs"
            />

            <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="bg-background/50 h-7 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {REGIONS.map((r) => (
                        <SelectItem key={r.code} value={r.code} className="text-xs">
                            {r.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Card>
    );
}
