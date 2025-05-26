package nl.bioinf.jscscheper.tool.servlets;

import nl.bioinf.jscscheper.tool.config.ApiResponse;
import nl.bioinf.jscscheper.tool.model.AirQualityStation;
import nl.bioinf.jscscheper.tool.service.AirQualityDataFetcher;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "AirQualityDataServlet", urlPatterns = "/airqualitydata")
public class AirQualityDataServlet extends HttpServlet {

    private final AirQualityDataFetcher fetcher = new AirQualityDataFetcher();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        List<AirQualityStation> stations = fetcher.getEuropeanStations();
        ApiResponse.writeJson(response, stations);
    }
}
