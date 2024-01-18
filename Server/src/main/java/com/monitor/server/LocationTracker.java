package com.monitor.server;

public class LocationTracker {
    private int id;
    private int zone;
    public LocationTracker(int id, int zone){
        this.id = id;
        this.zone = zone;
    }
    public void updateZone(int zone){
        this.zone = zone;
    }
    public int getZone() {
        return zone;
    }
    public int getId() {
        return id;
    }
}
