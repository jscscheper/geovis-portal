package nl.bioinf.jscscheper.tool.servlets;

import nl.bioinf.jscscheper.tool.config.ApiResponse;
import nl.bioinf.jscscheper.tool.model.BirdSighting;
import nl.bioinf.jscscheper.tool.service.BirdDataFetcher;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "BirdDataServlet", urlPatterns = "/birddata")
public class BirdDataServlet extends HttpServlet {

    private BirdDataFetcher fetcher;

    @Override
    public void init() {
        String apiKey = System.getenv("EBIRD_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = getServletContext().getInitParameter("ebird.api.key");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("[Birds] WARNING: No eBird API key configured! Set EBIRD_API_KEY env var.");
            apiKey = "";
        }
        fetcher = new BirdDataFetcher(apiKey);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            List<BirdSighting> sightings;

            String region = request.getParameter("region");

            if (region != null && !region.isEmpty()) {
                sightings = fetcher.getRecentSightingsByRegion(region);
            } else {
                double lat = parseDouble(request.getParameter("lat"), 52.1326);
                double lng = parseDouble(request.getParameter("lng"), 5.2913);
                int dist = parseInt(request.getParameter("dist"), 50);
                sightings = fetcher.getRecentSightings(lat, lng, dist);
            }

            ApiResponse.writeJson(response, sightings);
        } catch (Exception e) {
            System.err.println("[Birds] Error: " + e.getMessage());
            e.printStackTrace();
            ApiResponse.writeError(response, 500, "Failed to fetch bird data");
        }
    }

    private double parseDouble(String value, double defaultValue) {
        if (value == null)
            return defaultValue;
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private int parseInt(String value, int defaultValue) {
        if (value == null)
            return defaultValue;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
