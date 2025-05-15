package nl.bioinf.jscscheper.tool.servlets;

import nl.bioinf.jscscheper.tool.config.ApiResponse;
import nl.bioinf.jscscheper.tool.model.Earthquake;
import nl.bioinf.jscscheper.tool.service.EarthquakeDataFetcher;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "EarthquakeDataServlet", urlPatterns = "/mapdata")
public class EarthquakeDataServlet extends HttpServlet {

    private final EarthquakeDataFetcher fetcher = new EarthquakeDataFetcher();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String[]> params = request.getParameterMap();

        String rawData = fetcher.getEarthquakes(params);
        List<Earthquake> earthquakes = fetcher.responseToEarthquakes(rawData);

        ApiResponse.writeJson(response, earthquakes);
    }
}
