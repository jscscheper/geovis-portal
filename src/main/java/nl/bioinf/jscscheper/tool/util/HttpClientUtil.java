package nl.bioinf.jscscheper.tool.util;

import java.net.http.HttpClient;
import java.time.Duration;

public class HttpClientUtil {

    private static final HttpClient CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private HttpClientUtil() {
    }

    public static HttpClient getClient() {
        return CLIENT;
    }
}
