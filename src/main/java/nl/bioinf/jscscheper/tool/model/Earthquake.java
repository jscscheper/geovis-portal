package nl.bioinf.jscscheper.tool.model;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;

public class Earthquake {
    private String date;
    private String location;
    private String[] latLon;
    private float latitude;
    private float longitude;
    private float depth;
    private float magnitude;

    public Earthquake(String date, String location, String latitude,
            String longitude, String depth, String magnitude) {
        setDate(date);
        this.location = location;
        setCoordinates(latitude, longitude);
        setDepth(depth);
        setMagnitude(magnitude);
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String[] getLatLon() {
        return latLon;
    }

    public void setCoordinates(String latitude, String longitude) {
        String[] coordinates = { latitude, longitude };
        this.latLon = coordinates;
        try {
            this.latitude = Float.parseFloat(latitude);
            this.longitude = Float.parseFloat(longitude);
        } catch (NumberFormatException e) {
            this.latitude = 0.0f;
            this.longitude = 0.0f;
        }
    }

    public float getLatitude() {
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public float getDepth() {
        return depth;
    }

    public void setDepth(String depth) {
        try {
            this.depth = Float.parseFloat(depth.trim());
        } catch (Exception e) {
            this.depth = 0.0f;
        }
    }

    public float getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(String magnitude) {
        try {
            this.magnitude = Float.parseFloat(magnitude.trim());
        } catch (Exception e) {
            this.magnitude = 0.0f;
        }
    }

    @Override
    public String toString() {
        return "Earthquake{" +
                "date=" + date.toString() +
                ", location='" + location + '\'' +
                ", latLon=" + Arrays.toString(latLon) +
                ", depth=" + depth +
                ", magnitude=" + magnitude +
                '}';
    }
}
