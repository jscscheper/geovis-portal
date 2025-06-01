export interface WeatherStation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    elevationUnit?: string;
    temperature?: number;
    apparentTemperature?: number;
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
    uvIndex?: number;
    weatherCode?: number;
    isDay?: boolean;
}

export interface AirQualityStation {
    name: string;
    city: string;
    country: string;
    latLon: [string, string];
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
    so2: number;
    europeanAqi?: number;
    historyTime?: string[];
    historyPm25?: number[];
    historyPm10?: number[];
}

export type Pollutant = "pm25" | "pm10" | "no2" | "o3" | "co" | "so2";

export type AQILevel =
    | "good"
    | "moderate"
    | "unhealthySensitive"
    | "unhealthy"
    | "veryUnhealthy"
    | "hazardous";

export interface Earthquake {
    date: string;
    location: string;
    latitude: number;
    longitude: number;
    depth: number;
    magnitude: number;
}

export interface BirdSighting {
    speciesCode: string;
    comName: string;
    sciName: string;
    locName: string;
    obsDt: string;
    howMany: number;
    lat: number;
    lng: number;
    obsValid: boolean;
    obsReviewed: boolean;
}

export interface BenchmarkResult {
    endpoint: string;
    responseTime: number;
    status: "success" | "error";
    statusCode?: number;
    dataSize?: number;
    error?: string;
}

export interface BenchmarkTest {
    endpoint: string,
    status: "pending" | "running" | "done" | "error"
}
