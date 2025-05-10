package nl.bioinf.jscscheper.tool.model;

public class Station {

    private float elevation;
    private String mindate;
    private String maxdate;
    private float latitude;
    private float longitude;
    private String name;
    private String id;
    private float datacoverage;
    private String elevationUnit;

    private float temperature = Float.NaN;
    private float apparentTemperature = Float.NaN;
    private float humidity = Float.NaN;
    private float windSpeed = Float.NaN;
    private float windDirection = Float.NaN;
    private float uvIndex = Float.NaN;
    private int weatherCode = -1;
    private boolean isDay = true;

    public float getElevation() {
        return elevation;
    }

    public String getMindate() {
        return mindate;
    }

    public String getMaxdate() {
        return maxdate;
    }

    public float getLatitude() {
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }

    public float getDatacoverage() {
        return datacoverage;
    }

    public String getElevationUnit() {
        return elevationUnit;
    }

    public float getTemperature() {
        return temperature;
    }

    public float getHumidity() {
        return humidity;
    }

    public float getWindSpeed() {
        return windSpeed;
    }

    public int getWeatherCode() {
        return weatherCode;
    }

    public void setElevation(float elevation) {
        this.elevation = elevation;
    }

    public void setMindate(String mindate) {
        this.mindate = mindate;
    }

    public void setMaxdate(String maxdate) {
        this.maxdate = maxdate;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setDatacoverage(float datacoverage) {
        this.datacoverage = datacoverage;
    }

    public void setElevationUnit(String elevationUnit) {
        this.elevationUnit = elevationUnit;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public void setHumidity(float humidity) {
        this.humidity = humidity;
    }

    public void setWindSpeed(float windSpeed) {
        this.windSpeed = windSpeed;
    }

    public void setWeatherCode(int weatherCode) {
        this.weatherCode = weatherCode;
    }

    public float getApparentTemperature() {
        return apparentTemperature;
    }

    public void setApparentTemperature(float apparentTemperature) {
        this.apparentTemperature = apparentTemperature;
    }

    public float getWindDirection() {
        return windDirection;
    }

    public void setWindDirection(float windDirection) {
        this.windDirection = windDirection;
    }

    public float getUvIndex() {
        return uvIndex;
    }

    public void setUvIndex(float uvIndex) {
        this.uvIndex = uvIndex;
    }

    public boolean isDay() {
        return isDay;
    }

    public void setIsDay(boolean isDay) {
        this.isDay = isDay;
    }
}
