import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { BirdSighting } from "@/types";
import { getBirdColor } from "@/hooks/useBirdSightings";

interface Props {
    items: BirdSighting[];
    loading: boolean;
    selection: BirdSighting | null;
    onSelect: (sighting: BirdSighting) => void;
}

export function BirdList({ items, loading, selection, onSelect }: Props) {
    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 !gap-0 !py-0 flex-1 min-h-0 flex flex-col">
            <div className="p-3 border-b border-border/50 flex justify-between items-center bg-card/50">
                <span className="text-xs font-medium text-muted-foreground">Recent Sightings</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {items.length}
                </Badge>
            </div>

            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">Fetching data...</div>
                ) : (
                    <div className="p-2 space-y-1">
                        {items.slice(0, 50).map((item, i) => {
                            const isSelected = selection?.speciesCode === item.speciesCode && selection?.lat === item.lat;

                            return (
                                <div
                                    key={`${item.speciesCode}-${i}`}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all border ${isSelected
                                            ? "bg-primary/10 border-primary/40"
                                            : "border-transparent hover:bg-accent/50"
                                        }`}
                                    onClick={() => onSelect(item)}
                                >
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-xs font-medium truncate text-foreground/90">
                                            {item.comName}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {item.locName}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {item.obsValid && (
                                            <CheckCircle className="w-3 h-3 text-green-500/80" />
                                        )}
                                        {item.howMany > 0 && (
                                            <div
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: getBirdColor(item.speciesCode) }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
