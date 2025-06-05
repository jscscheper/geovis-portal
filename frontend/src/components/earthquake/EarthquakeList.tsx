import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Earthquake } from "@/types";

interface Props {
    items: Earthquake[];
    selection: Earthquake | null;
    onSelect: (eq: Earthquake) => void;
    loading: boolean;
}

export function EarthquakeList({ items, selection, onSelect, loading }: Props) {
    return (
        <Card className="bg-card/80 backdrop-blur-md border-border/50 !gap-0 !py-0 flex-1 min-h-0 flex flex-col">
            <div className="p-3 border-b border-border/50 flex justify-between items-center bg-card/50">
                <span className="text-xs font-medium text-muted-foreground">Recent Events</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {items.length}
                </Badge>
            </div>

            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">No events found.</div>
                ) : (
                    <div className="p-2 space-y-1">
                        {items.slice(0, 50).map((eq, i) => {
                            const isSelected = selection?.date === eq.date && selection?.location === eq.location;
                            const isSevere = eq.magnitude >= 5;
                            const isModerate = eq.magnitude >= 3;

                            return (
                                <div
                                    key={`${eq.date}-${i}`}
                                    onClick={() => onSelect(eq)}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer border transition-colors ${isSelected
                                            ? "bg-primary/10 border-primary/40"
                                            : "border-transparent hover:bg-accent/50"
                                        }`}
                                >
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-xs font-medium truncate text-foreground/90">{eq.location}</p>
                                        <p className="text-[10px] text-muted-foreground">{new Date(eq.date).toLocaleDateString()}</p>
                                    </div>
                                    <Badge
                                        variant={isSevere ? "destructive" : isModerate ? "default" : "secondary"}
                                        className="h-5 text-[10px] px-1.5"
                                    >
                                        {eq.magnitude.toFixed(1)}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
