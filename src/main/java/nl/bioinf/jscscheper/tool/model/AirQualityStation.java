package nl.bioinf.jscscheper.tool.model;

public class AirQualityStation {
    private String name;
    private String[] latLon;
    private String country;
    private String city;
    private double pm25;
    private double pm10;
    private double o3;
    private double no2;
    private double co;
    private double so2;
    private int europeanAqi;
    private String lastUpdated;

    private String[] historyTime;
    private double[] historyPm25;
    private double[] historyPm10;

    public AirQualityStation(String name, String latitude, String longitude,
            String country, String city, String lastUpdated) {
        this.name = name;
        this.latLon = new String[] { latitude, longitude };
        this.country = country;
        this.city = city;
        this.lastUpdated = lastUpdated;
        this.pm25 = -1;
        this.pm10 = -1;
        this.o3 = -1;
        this.no2 = -1;
        this.co = -1;
        this.so2 = -1;
    }

    public String getName() {
        return name;
    }

    public String[] getLatLon() {
        return latLon;
    }

    public String getCountry() {
        return country;
    }

    public String getCity() {
        return city;
    }

    public double getPm25() {
        return pm25;
    }

    public double getPm10() {
        return pm10;
    }

    public double getO3() {
        return o3;
    }

    public double getNo2() {
        return no2;
    }

    public double getCo() {
        return co;
    }

    public double getSo2() {
        return so2;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setPm25(double value) {
        this.pm25 = value;
    }

    public void setPm10(double value) {
        this.pm10 = value;
    }

    public void setO3(double value) {
        this.o3 = value;
    }

    public void setNo2(double value) {
        this.no2 = value;
    }

    public void setCo(double value) {
        this.co = value;
    }

    public void setSo2(double value) {
        this.so2 = value;
    }

    public int getEuropeanAqi() {
        return europeanAqi;
    }

    public void setEuropeanAqi(int europeanAqi) {
        this.europeanAqi = europeanAqi;
    }

    public String[] getHistoryTime() {
        return historyTime;
    }

    public double[] getHistoryPm25() {
        return historyPm25;
    }

    public double[] getHistoryPm10() {
        return historyPm10;
    }

    public void setHistoryTime(String[] historyTime) {
        this.historyTime = historyTime;
    }

    public void setHistoryPm25(double[] historyPm25) {
        this.historyPm25 = historyPm25;
    }

    public void setHistoryPm10(double[] historyPm10) {
        this.historyPm10 = historyPm10;
    }
}
