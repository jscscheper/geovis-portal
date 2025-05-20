package nl.bioinf.jscscheper.tool.servlets;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import nl.bioinf.jscscheper.tool.config.ApiResponse;
import nl.bioinf.jscscheper.tool.model.Station;
import nl.bioinf.jscscheper.tool.service.WeatherDataFetcher;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@WebServlet(name = "WeatherDataServlet", urlPatterns = { "/stationdownload", "/weatherdata" })
public class WeatherDataServlet extends HttpServlet {

    private static final Gson GSON = new Gson();
    private static final String STATIONS_FILE = "/WEB-INF/stations.json";
    private static final WeatherDataFetcher weatherFetcher = new WeatherDataFetcher();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String path = request.getServletPath();
        String countryParam = request.getParameter("country");
        String nstationsParam = request.getParameter("nstations");

        try {
            if (countryParam != null && !countryParam.isEmpty() && !countryParam.equals("all")) {
                List<Station> countryStations = weatherFetcher.getStationsByCountry(countryParam.toUpperCase());
                ApiResponse.writeJson(response, countryStations);
                return;
            }

            int defaultCount = path.equals("/weatherdata") ? 100 : 1000;
            int nstations = (nstationsParam != null) ? Integer.parseInt(nstationsParam) : defaultCount;

            List<Station> stations = loadStations();
            List<Station> randomStations = pickRandom(stations, Math.min(nstations, stations.size()));

            if (path.equals("/weatherdata")) {
                randomStations = weatherFetcher.enrichWithWeatherData(randomStations);
            }

            ApiResponse.writeJson(response, randomStations);
        } catch (Exception e) {
            System.err.println("[Weather] Error loading stations: " + e.getMessage());
            e.printStackTrace();
            ApiResponse.writeError(response, 500, "Failed to load station data");
        }
    }

    private List<Station> loadStations() throws IOException {
        ServletContext context = getServletContext();
        try (InputStream is = context.getResourceAsStream(STATIONS_FILE);
                BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            return GSON.fromJson(reader, new TypeToken<List<Station>>() {
            }.getType());
        }
    }

    private static <E> List<E> pickRandom(List<E> list, int n) {
        if (list.isEmpty() || n <= 0)
            return Collections.emptyList();
        return new Random()
                .ints(n, 0, list.size())
                .mapToObj(list::get)
                .collect(Collectors.toList());
    }
}
