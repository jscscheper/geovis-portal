import { Card } from "@/components/ui/card";
import { DistributionChart } from "@/components/ui/DistributionChart";

interface Props {
    data: any[];
    onBarClick: (index: number) => void;
    hasActiveFilter: boolean;
}

export function EarthquakeStats({ data, onBarClick, hasActiveFilter }: Props) {
    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 p-3">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                Magnitude Distribution
            </h3>
            <div className="h-24">
                <DistributionChart
                    data={data}
                    onBarClick={onBarClick}
                    hasActiveFilter={hasActiveFilter}
                />
            </div>
        </Card>
    );
}
