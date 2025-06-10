"use client";

import { useBenchmark } from "@/hooks/useBenchmark";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gauge, Loader2, CheckCircle, XCircle, RotateCcw, Zap } from "lucide-react";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getSpeedColor(ms: number): string {
    if (ms < 100) return "text-green-500";
    if (ms < 300) return "text-yellow-500";
    if (ms < 1000) return "text-orange-500";
    return "text-red-500";
}

function getSpeedBadgeVariant(ms: number): "default" | "secondary" | "destructive" {
    if (ms < 300) return "secondary";
    if (ms < 1000) return "default";
    return "destructive";
}

export default function BenchmarkPage() {
    const {
        endpoints,
        selectedEndpoints,
        toggleEndpoint,
        startBenchmark,
        resetBenchmark,
        isRunning,
        isFinished,
        runningTests,
        results,
    } = useBenchmark();

    const avgResponseTime = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
        : 0;

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <Gauge className="w-8 h-8 text-cyan-400" />
                    API Performance
                </h1>
                <p className="text-muted-foreground mb-8">
                    Test response times for the application&apos;s data endpoints
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="!gap-0 !py-0">
                        <div className="p-4 space-y-4">
                            <h2 className="text-lg font-semibold">Select Endpoints</h2>
                            <p className="text-sm text-muted-foreground">
                                Choose which APIs to benchmark
                            </p>

                            <div className="space-y-2">
                                {endpoints.map((endpoint) => (
                                    <label
                                        key={endpoint.name}
                                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${selectedEndpoints.includes(endpoint.name)
                                            ? "bg-primary/20 border border-primary/50"
                                            : "bg-accent/30 hover:bg-accent/50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedEndpoints.includes(endpoint.name)}
                                            onChange={() => toggleEndpoint(endpoint.name)}
                                            className="w-4 h-4 rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{endpoint.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {endpoint.description}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={startBenchmark}
                                    disabled={isRunning || selectedEndpoints.length === 0}
                                    className="flex-1"
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Run Benchmark
                                        </>
                                    )}
                                </Button>
                                {isFinished && (
                                    <Button variant="outline" onClick={resetBenchmark}>
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        {isRunning && !isFinished && (
                            <Card className="!gap-0 !py-0">
                                <div className="p-4 space-y-4">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                        Testing Endpoints
                                    </h2>
                                    <div className="space-y-2">
                                        {runningTests.map((test) => (
                                            <div
                                                key={test.endpoint}
                                                className="flex items-center justify-between p-2 bg-accent/30 rounded-md"
                                            >
                                                <span className="text-sm">{test.endpoint}</span>
                                                <Badge variant="secondary">
                                                    {test.status === "running" ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : test.status === "done" ? (
                                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                                    ) : test.status === "error" ? (
                                                        <XCircle className="w-3 h-3 text-red-500" />
                                                    ) : (
                                                        "Pending"
                                                    )}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {isFinished && results.length > 0 && (
                            <Card className="!gap-0 !py-0">
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            Results
                                        </h2>
                                        <Badge variant="outline" className="text-sm">
                                            Avg: <span className={getSpeedColor(avgResponseTime)}>{avgResponseTime}ms</span>
                                        </Badge>
                                    </div>

                                    <ScrollArea className="h-64">
                                        <div className="space-y-2">
                                            {results
                                                .sort((a, b) => a.responseTime - b.responseTime)
                                                .map((result, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-3 bg-accent/30 rounded-md space-y-1"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium flex items-center gap-2">
                                                                {result.status === "success" ? (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                {result.endpoint}
                                                            </span>
                                                            <Badge variant={getSpeedBadgeVariant(result.responseTime)}>
                                                                {result.responseTime}ms
                                                            </Badge>
                                                        </div>
                                                        {result.status === "success" && result.dataSize && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Response size: {formatBytes(result.dataSize)}
                                                                {result.statusCode && ` • Status: ${result.statusCode}`}
                                                            </p>
                                                        )}
                                                        {result.status === "error" && result.error && (
                                                            <p className="text-xs text-red-400">
                                                                Error: {result.error}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border/50">
                                        <div>
                                            <p className="text-lg font-bold text-green-500">
                                                {results.filter(r => r.responseTime < 100).length}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">Fast (&lt;100ms)</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-yellow-500">
                                                {results.filter(r => r.responseTime >= 100 && r.responseTime < 500).length}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">OK (100-500ms)</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-red-500">
                                                {results.filter(r => r.responseTime >= 500 || r.status === "error").length}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">Slow/Error</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {!isRunning && !isFinished && (
                            <Card className="!gap-0 !py-0">
                                <div className="p-8 text-center text-muted-foreground">
                                    <Gauge className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                    <p>Select endpoints and click &quot;Run Benchmark&quot; to test API response times</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
