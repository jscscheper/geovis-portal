package nl.bioinf.jscscheper.tool.service;

import nl.bioinf.jscscheper.tool.model.Earthquake;
import org.apache.hc.core5.net.URIBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import nl.bioinf.jscscheper.tool.util.HttpClientUtil;

public class EarthquakeDataFetcher {

    private static final String KNMI_API = "http://rdsa.knmi.nl/fdsnws/event/1/query";

    private static final HttpClient CLIENT = HttpClientUtil.getClient();

    public String getEarthquakes(Map<String, String[]> params) {
        try {
            String limit = params.getOrDefault("limit", new String[] { "10" })[0];

            URI knmiURI = new URIBuilder(KNMI_API)
                    .addParameter("format", "text")
                    .addParameter("limit", limit)
                    .build();

            HttpResponse<String> response = CLIENT.send(
                    HttpRequest.newBuilder(knmiURI)
                            .timeout(Duration.ofSeconds(10))
                            .GET()
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return response.body();
            }

            System.err.println("[Earthquake] KNMI returned status: " + response.statusCode());
        } catch (URISyntaxException | InterruptedException | IOException e) {
            System.err.println("[Earthquake] Request failed: " + e.getMessage());
        }
        return "";
    }

    public List<Earthquake> responseToEarthquakes(String response) {
        List<Earthquake> data = new ArrayList<>();

        if (response == null || response.isEmpty()) {
            return data;
        }

        String[] lines = response.split("\\r?\\n");
        for (String line : lines) {
            if (line.startsWith("#") || line.trim().isEmpty()) {
                continue;
            }

            String[] fields = line.split("\\|");
            if (fields.length < 13) {
                continue;
            }

            try {
                Earthquake eq = new Earthquake(
                        fields[1],
                        fields[12],
                        fields[2],
                        fields[3],
                        fields[4],
                        fields[10].isEmpty() ? "0.0" : fields[10]);
                data.add(eq);
            } catch (Exception e) {
                System.err.println("[Earthquake] Skipping malformed record: " + line);
            }
        }

        return data;
    }
}
