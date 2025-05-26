package nl.bioinf.jscscheper.tool.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import nl.bioinf.jscscheper.tool.model.BirdSighting;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import nl.bioinf.jscscheper.tool.util.HttpClientUtil;

public class BirdDataFetcher {

    private static final String EBIRD_API = "https://api.ebird.org/v2/data/obs/geo/recent";
    private static final Gson GSON = new Gson();

    private static final HttpClient CLIENT = HttpClientUtil.getClient();

    private static List<BirdSighting> cachedSightings = null;
    private static long cacheTime = 0;
    private static final long CACHE_TTL = 5 * 60 * 1000;
    private static String cachedParams = "";

    private final String apiKey;

    public BirdDataFetcher(String apiKey) {
        this.apiKey = apiKey;
    }

    public List<BirdSighting> getRecentSightings(double lat, double lng, int distKm) {
        String params = lat + "," + lng + "," + distKm;

        if (cachedSightings != null &&
                System.currentTimeMillis() - cacheTime < CACHE_TTL &&
                params.equals(cachedParams)) {
            System.out.println("[Birds] Returning cached data (" + cachedSightings.size() + " sightings)");
            return cachedSightings;
        }

        List<BirdSighting> sightings = new ArrayList<>();

        try {
            String url = EBIRD_API +
                    "?lat=" + lat +
                    "&lng=" + lng +
                    "&dist=" + Math.min(distKm, 50) +
                    "&maxResults=200";

            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .header("x-ebirdapitoken", apiKey)
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                sightings = parseSightings(response.body());
                System.out.println("[Birds] Fetched " + sightings.size() + " sightings from eBird");
            } else {
                System.err.println("[Birds] eBird API returned status " + response.statusCode());
                System.err.println("[Birds] Response: " + response.body());
            }
        } catch (InterruptedException | IOException e) {
            System.err.println("[Birds] Request failed: " + e.getMessage());
        }

        cachedSightings = sightings;
        cacheTime = System.currentTimeMillis();
        cachedParams = params;

        return sightings;
    }

    public List<BirdSighting> getRecentSightingsByRegion(String regionCode) {
        String params = "region:" + regionCode;

        if (cachedSightings != null &&
                System.currentTimeMillis() - cacheTime < CACHE_TTL &&
                params.equals(cachedParams)) {
            System.out.println(
                    "[Birds] Returning cached data for " + regionCode + " (" + cachedSightings.size() + " sightings)");
            return cachedSightings;
        }

        List<BirdSighting> sightings = new ArrayList<>();

        try {
            String url = "https://api.ebird.org/v2/data/obs/" + regionCode + "/recent" +
                    "?maxResults=200";

            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .header("x-ebirdapitoken", apiKey)
                    .timeout(Duration.ofSeconds(20))
                    .GET()
                    .build();

            HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                sightings = parseSightings(response.body());
                System.out.println("[Birds] Fetched " + sightings.size() + " sightings from region " + regionCode);
            } else {
                System.err.println(
                        "[Birds] eBird API returned status " + response.statusCode() + " for region " + regionCode);
                System.err.println("[Birds] Response: " + response.body());
            }
        } catch (InterruptedException | IOException e) {
            System.err.println("[Birds] Region request failed: " + e.getMessage());
        }

        cachedSightings = sightings;
        cacheTime = System.currentTimeMillis();
        cachedParams = params;

        return sightings;
    }

    private List<BirdSighting> parseSightings(String json) {
        try {
            return GSON.fromJson(json, new TypeToken<List<BirdSighting>>() {
            }.getType());
        } catch (Exception e) {
            System.err.println("[Birds] Parse error: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
