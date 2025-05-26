package nl.bioinf.jscscheper.tool.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.bioinf.jscscheper.tool.model.AirQualityStation;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import nl.bioinf.jscscheper.tool.util.EuropeanCities;
import nl.bioinf.jscscheper.tool.util.HttpClientUtil;

public class AirQualityDataFetcher {

    private static final String OPEN_METEO_API = "https://air-quality-api.open-meteo.com/v1/air-quality";

    private static final HttpClient CLIENT = HttpClientUtil.getClient();

    private static List<AirQualityStation> cachedStations = null;
    private static long cacheTime = 0;
    private static final long CACHE_TTL = 15 * 60 * 1000;

    public List<AirQualityStation> getEuropeanStations() {
        if (cachedStations != null && System.currentTimeMillis() - cacheTime < CACHE_TTL) {
            System.out.println("[AirQuality] Returning cached data (" + cachedStations.size() + " stations)");
            return cachedStations;
        }

        List<AirQualityStation> stations = new ArrayList<>();

        for (Map.Entry<String, String[][]> entry : EuropeanCities.CITIES_BY_COUNTRY.entrySet()) {
            String country = entry.getKey();
            for (String[] cityData : entry.getValue()) {
                String cityName = cityData[0];
                String lat = cityData[1];
                String lon = cityData[2];

                try {
                    AirQualityStation station = fetchCityData(cityName, country, lat, lon);
                    if (station != null) {
                        stations.add(station);
                    }
                    Thread.sleep(50);
                } catch (Exception e) {
                    System.err.println("[AirQuality] Error fetching " + cityName + ": " + e.getMessage());
                }
            }
        }

        System.out.println("[AirQuality] Fetched " + stations.size() + " stations from Open-Meteo");

        cachedStations = stations;
        cacheTime = System.currentTimeMillis();

        return stations;
    }

    private AirQualityStation fetchCityData(String name, String country, String lat, String lon) {
        try {
            String url = OPEN_METEO_API + "?latitude=" + lat + "&longitude=" + lon +
                    "&current=pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide,sulphur_dioxide,european_aqi" +
                    "&hourly=pm2_5,pm10&past_days=7";

            HttpResponse<String> response = CLIENT.send(
                    HttpRequest.newBuilder(URI.create(url))
                            .timeout(Duration.ofSeconds(10))
                            .GET()
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseOpenMeteoResponse(response.body(), name, country, lat, lon);
            }
        } catch (InterruptedException | IOException e) {
            System.err.println("[AirQuality] Request failed for " + name + ": " + e.getMessage());
        }
        return null;
    }

    private AirQualityStation parseOpenMeteoResponse(String jsonResponse, String name, String country, String lat,
            String lon) {
        try {
            JsonObject root = JsonParser.parseString(jsonResponse).getAsJsonObject();
            JsonObject current = root.getAsJsonObject("current");

            if (current == null)
                return null;

            AirQualityStation station = new AirQualityStation(name, lat, lon, country, name, "");

            station.setPm25(getDoubleOrDefault(current, "pm2_5", -1));
            station.setPm10(getDoubleOrDefault(current, "pm10", -1));
            station.setNo2(getDoubleOrDefault(current, "nitrogen_dioxide", -1));
            station.setO3(getDoubleOrDefault(current, "ozone", -1));
            station.setCo(getDoubleOrDefault(current, "carbon_monoxide", -1));
            station.setSo2(getDoubleOrDefault(current, "sulphur_dioxide", -1));
            station.setEuropeanAqi((int) getDoubleOrDefault(current, "european_aqi", 0));

            JsonObject hourly = root.getAsJsonObject("hourly");
            if (hourly != null) {
                parseHistoryArrays(station, hourly);
            }

            return station;
        } catch (Exception e) {
            System.err.println("[AirQuality] Parse error for " + name + ": " + e.getMessage());
        }
        return null;
    }

    private double getDoubleOrDefault(JsonObject obj, String key, double defaultValue) {
        if (obj.has(key) && !obj.get(key).isJsonNull()) {
            return obj.get(key).getAsDouble();
        }
        return defaultValue;
    }

    private void parseHistoryArrays(AirQualityStation station, JsonObject hourly) {
        JsonArray timeArray = hourly.getAsJsonArray("time");
        if (timeArray != null) {
            String[] times = new String[timeArray.size()];
            for (int i = 0; i < timeArray.size(); i++) {
                times[i] = timeArray.get(i).getAsString();
            }
            station.setHistoryTime(times);
        }

        JsonArray pm25Array = hourly.getAsJsonArray("pm2_5");
        if (pm25Array != null) {
            double[] pm25Values = new double[pm25Array.size()];
            for (int i = 0; i < pm25Array.size(); i++) {
                pm25Values[i] = pm25Array.get(i).isJsonNull() ? -1 : pm25Array.get(i).getAsDouble();
            }
            station.setHistoryPm25(pm25Values);
        }

        JsonArray pm10Array = hourly.getAsJsonArray("pm10");
        if (pm10Array != null) {
            double[] pm10Values = new double[pm10Array.size()];
            for (int i = 0; i < pm10Array.size(); i++) {
                pm10Values[i] = pm10Array.get(i).isJsonNull() ? -1 : pm10Array.get(i).getAsDouble();
            }
            station.setHistoryPm10(pm10Values);
        }
    }
}
