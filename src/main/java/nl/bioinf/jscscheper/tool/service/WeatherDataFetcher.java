package nl.bioinf.jscscheper.tool.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.bioinf.jscscheper.tool.model.Station;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import nl.bioinf.jscscheper.tool.util.EuropeanCities;
import nl.bioinf.jscscheper.tool.util.HttpClientUtil;

public class WeatherDataFetcher {

    private static final String OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

    private static final HttpClient CLIENT = HttpClientUtil.getClient();

    private static List<Station> cachedStations = null;
    private static long cacheTime = 0;
    private static final long CACHE_TTL = 15 * 60 * 1000;

    private static java.util.Map<String, List<Station>> countryCache = new java.util.HashMap<>();
    private static java.util.Map<String, Long> countryCacheTime = new java.util.HashMap<>();

    private static final java.util.Map<String, String[][]> EUROPEAN_CITIES = EuropeanCities.CITIES_BY_COUNTRY;

    public List<Station> getStationsByCountry(String countryCode) {
        Long cached = countryCacheTime.get(countryCode);
        if (cached != null && System.currentTimeMillis() - cached < CACHE_TTL) {
            System.out.println("[Weather] Returning cached data for " + countryCode);
            return countryCache.get(countryCode);
        }

        String[][] cities = EUROPEAN_CITIES.get(countryCode);
        if (cities == null) {
            System.err.println("[Weather] No cities defined for country: " + countryCode);
            return new ArrayList<>();
        }

        List<Station> stations = new ArrayList<>();
        for (int i = 0; i < cities.length; i++) {
            Station s = new Station();
            s.setId(countryCode + "-" + i);
            s.setName(cities[i][0] + ", " + countryCode);
            s.setLatitude(Float.parseFloat(cities[i][1]));
            s.setLongitude(Float.parseFloat(cities[i][2]));
            stations.add(s);
        }

        List<Station> enriched = fetchWeatherForStations(stations);

        countryCache.put(countryCode, enriched);
        countryCacheTime.put(countryCode, System.currentTimeMillis());

        return enriched;
    }

    private List<Station> fetchWeatherForStations(List<Station> stations) {
        if (stations.isEmpty())
            return stations;

        StringBuilder lats = new StringBuilder();
        StringBuilder lons = new StringBuilder();

        for (int i = 0; i < stations.size(); i++) {
            if (i > 0) {
                lats.append(",");
                lons.append(",");
            }
            lats.append(stations.get(i).getLatitude());
            lons.append(stations.get(i).getLongitude());
        }

        try {
            String url = OPEN_METEO_API +
                    "?latitude=" + lats + "&longitude=" + lons +
                    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day"
                    +
                    "&timezone=auto";

            HttpResponse<String> response = CLIENT.send(
                    HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(30)).GET().build(),
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseWeatherResponse(response.body(), stations);
            }
        } catch (Exception e) {
            System.err.println("[Weather] Country fetch failed: " + e.getMessage());
        }
        return stations;
    }

    public List<Station> enrichWithWeatherData(List<Station> stations) {
        if (cachedStations != null && System.currentTimeMillis() - cacheTime < CACHE_TTL) {
            System.out.println("[Weather] Returning cached data (" + cachedStations.size() + " stations)");
            return cachedStations;
        }

        List<Station> enrichedStations = new ArrayList<>();

        StringBuilder lats = new StringBuilder();
        StringBuilder lons = new StringBuilder();

        for (int i = 0; i < stations.size(); i++) {
            Station s = stations.get(i);
            if (i > 0) {
                lats.append(",");
                lons.append(",");
            }
            lats.append(s.getLatitude());
            lons.append(s.getLongitude());
        }

        try {
            String url = OPEN_METEO_API +
                    "?latitude=" + lats +
                    "&longitude=" + lons +
                    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day"
                    +
                    "&timezone=auto";

            HttpResponse<String> response = CLIENT.send(
                    HttpRequest.newBuilder(URI.create(url))
                            .timeout(Duration.ofSeconds(30))
                            .GET()
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                enrichedStations = parseWeatherResponse(response.body(), stations);
            } else {
                System.err.println("[Weather] API returned status " + response.statusCode());
                enrichedStations = stations;
            }
        } catch (InterruptedException | IOException e) {
            System.err.println("[Weather] Request failed: " + e.getMessage());
            enrichedStations = stations;
        }

        System.out.println("[Weather] Enriched " + enrichedStations.size() + " stations");

        cachedStations = enrichedStations;
        cacheTime = System.currentTimeMillis();

        return enrichedStations;
    }

    private List<Station> parseWeatherResponse(String jsonResponse, List<Station> originalStations) {
        List<Station> result = new ArrayList<>();

        try {
            var parsed = JsonParser.parseString(jsonResponse);

            if (parsed.isJsonArray()) {
                var array = parsed.getAsJsonArray();
                for (int i = 0; i < array.size() && i < originalStations.size(); i++) {
                    JsonObject stationData = array.get(i).getAsJsonObject();
                    Station enriched = enrichStation(originalStations.get(i), stationData);
                    result.add(enriched);
                }
            } else {
                JsonObject stationData = parsed.getAsJsonObject();
                Station enriched = enrichStation(originalStations.get(0), stationData);
                result.add(enriched);
            }
        } catch (Exception e) {
            System.err.println("[Weather] Parse error: " + e.getMessage());
            return originalStations;
        }

        return result;
    }

    private Station enrichStation(Station original, JsonObject data) {
        Station enriched = new Station();

        enriched.setId(original.getId());
        enriched.setName(original.getName());
        enriched.setLatitude(original.getLatitude());
        enriched.setLongitude(original.getLongitude());
        enriched.setElevation(original.getElevation());
        enriched.setElevationUnit(original.getElevationUnit());
        enriched.setMindate(original.getMindate());
        enriched.setMaxdate(original.getMaxdate());
        enriched.setDatacoverage(original.getDatacoverage());

        JsonObject current = data.getAsJsonObject("current");
        if (current != null) {
            enriched.setTemperature(getFloatOrDefault(current, "temperature_2m", Float.NaN));
            enriched.setApparentTemperature(getFloatOrDefault(current, "apparent_temperature", Float.NaN));
            enriched.setHumidity(getFloatOrDefault(current, "relative_humidity_2m", Float.NaN));
            enriched.setWindSpeed(getFloatOrDefault(current, "wind_speed_10m", Float.NaN));
            enriched.setWindDirection(getFloatOrDefault(current, "wind_direction_10m", Float.NaN));
            enriched.setUvIndex(getFloatOrDefault(current, "uv_index", Float.NaN));
            enriched.setWeatherCode(getIntOrDefault(current, "weather_code", -1));
            enriched.setIsDay(getIntOrDefault(current, "is_day", 1) == 1);
        }

        return enriched;
    }

    private float getFloatOrDefault(JsonObject obj, String key, float defaultValue) {
        if (obj.has(key) && !obj.get(key).isJsonNull()) {
            return obj.get(key).getAsFloat();
        }
        return defaultValue;
    }

    private int getIntOrDefault(JsonObject obj, String key, int defaultValue) {
        if (obj.has(key) && !obj.get(key).isJsonNull()) {
            return obj.get(key).getAsInt();
        }
        return defaultValue;
    }
}
