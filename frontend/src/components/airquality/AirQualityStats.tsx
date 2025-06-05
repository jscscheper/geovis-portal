import { Card } from "@/components/ui/card";
import { DistributionChart } from "@/components/ui/DistributionChart";

interface Props {
    summary: { good: number; moderate: number; unhealthy: number; total: number };
    distribution: any[];
    activeFilter: any;
    onToggleFilter: (level: any) => void;
}

export function AirQualityStats({ summary, distribution, activeFilter, onToggleFilter }: Props) {
    const handleBarClick = (index: number) => {
        const level = distribution[index]?.level;
        if (level) onToggleFilter(level);
    };

    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 p-3">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Distribution</h3>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold mb-2">
                <div>
                    <p className="text-green-500">{summary.good}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Good</p>
                </div>
                <div>
                    <p className="text-yellow-500">{summary.moderate}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Mod</p>
                </div>
                <div>
                    <p className="text-red-500">{summary.unhealthy}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Poor</p>
                </div>
                <div>
                    <p className="text-foreground">{summary.total}</p>
                    <p className="text-[9px] font-normal text-muted-foreground">Total</p>
                </div>
            </div>
            <div className="h-20">
                <DistributionChart
                    data={distribution}
                    onBarClick={handleBarClick}
                    hasActiveFilter={activeFilter !== null}
                    height={80}
                />
            </div>
        </Card>
    );
}
