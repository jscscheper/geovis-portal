import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { BirdSighting } from "@/types";
import { getBirdColor } from "@/hooks/useBirdSightings";

export function BirdDetails({ data }: { data: BirdSighting }) {
    if (!data) return null;

    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 !gap-0 !py-0">
            <div className="p-3 space-y-2">
                <div className="flex items-start gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: getBirdColor(data.speciesCode) + "40" }}
                    >
                        🐦
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{data.comName}</p>
                        <p className="text-xs text-muted-foreground italic truncate">
                            {data.sciName}
                        </p>
                    </div>
                    {data.howMany > 0 && (
                        <Badge variant="secondary" className="shrink-0">{data.howMany}</Badge>
                    )}
                </div>

                <div className="text-xs text-muted-foreground flex justify-between items-center pt-1 border-t border-border/50">
                    <p className="flex items-center gap-1 truncate max-w-[70%]">
                        <MapPin className="w-3 h-3" />
                        {data.locName}
                    </p>
                    <p>{data.obsDt}</p>
                </div>
            </div>
        </Card>
    );
}
