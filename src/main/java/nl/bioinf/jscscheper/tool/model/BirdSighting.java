package nl.bioinf.jscscheper.tool.model;

public class BirdSighting {

    private String speciesCode;
    private String comName;
    private String sciName;
    private double lat;
    private double lng;
    private String locName;
    private String locId;
    private String obsDt;
    private int howMany;
    private boolean obsValid;
    private boolean obsReviewed;
    private boolean locationPrivate;
    private String subId;

    public BirdSighting() {
    }

    public String getSpeciesCode() {
        return speciesCode;
    }

    public String getCommonName() {
        return comName;
    }

    public String getScientificName() {
        return sciName;
    }

    public double getLatitude() {
        return lat;
    }

    public double getLongitude() {
        return lng;
    }

    public String getLocationName() {
        return locName;
    }

    public String getObservationDate() {
        return obsDt;
    }

    public int getHowMany() {
        return howMany;
    }

    public boolean isObsValid() {
        return obsValid;
    }

    public boolean isObsReviewed() {
        return obsReviewed;
    }

    public String getLocId() {
        return locId;
    }

    public String getSubId() {
        return subId;
    }

    public boolean isLocationPrivate() {
        return locationPrivate;
    }

    public void setSpeciesCode(String speciesCode) {
        this.speciesCode = speciesCode;
    }

    public void setComName(String comName) {
        this.comName = comName;
    }

    public void setSciName(String sciName) {
        this.sciName = sciName;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public void setLocName(String locName) {
        this.locName = locName;
    }

    public void setObsDt(String obsDt) {
        this.obsDt = obsDt;
    }

    public void setHowMany(int howMany) {
        this.howMany = howMany;
    }

    public void setLocationPrivate(boolean locationPrivate) {
        this.locationPrivate = locationPrivate;
    }
}
