package nl.bioinf.jscscheper.tool.config;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class WebConfig implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent event) {
        System.out.println("[GeoVis] API Server starting...");
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        System.out.println("[GeoVis] API Server shutting down.");
    }
}