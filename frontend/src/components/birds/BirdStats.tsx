import { Card } from "@/components/ui/card";
import { DistributionChart } from "@/components/ui/DistributionChart";
import { getBirdColor, REGIONS } from "@/hooks/useBirdSightings";

interface Props {
    stats: {
        sightings: number;
        species: number;
        totalBirds: number;
        locations: number;
    };
    distribution: any[];
    activeSpecies: string | null;
    onToggleSpecies: (code: string) => void;
    regionCode: string;
}

export function BirdStats({ stats, distribution, activeSpecies, onToggleSpecies, regionCode }: Props) {
    const regionName = REGIONS.find(r => r.code === regionCode)?.name || regionCode;

    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 p-3">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">{regionName}</h3>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold mb-2">
                <div>
                    <p className="text-green-400">{stats.sightings}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Reports</p>
                </div>
                <div>
                    <p className="text-blue-400">{stats.species}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Species</p>
                </div>
                <div>
                    <p className="text-yellow-400">{stats.totalBirds}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Birds</p>
                </div>
                <div>
                    <p className="text-foreground">{stats.locations}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Locs</p>
                </div>
            </div>
            <div className="h-20">
                <DistributionChart
                    data={distribution.slice(0, 5)}
                    onBarClick={(i) => {
                        const entry = distribution[i];
                        if (entry) onToggleSpecies(entry.code);
                    }}
                    hasActiveFilter={!!activeSpecies}
                    height={80}
                />
            </div>
        </Card>
    );
}
