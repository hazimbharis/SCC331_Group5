package com.prison.database;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

public class DatabaseUpdater {
    private boolean DEBUG = true;
    private URL url;
    public DatabaseUpdater() {
        try {
            url = new URL("http://localhost:8080");
        }catch (Exception e){
            System.out.println("couldn't connect to host, server not running?");
        }
    }

    //old code from 330

//    public ArrayList<LocationTracker> getTrackers(){
//        try{
//            URL getURL = new URL(url+"/getAllLocs");
//            if (DEBUG) {System.out.println(getURL);}
//            if(ping(getURL)){
//                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//                connection.setRequestMethod("GET");
//                connection.connect();
//                int responseCode = connection.getResponseCode();
//                if(responseCode == HttpURLConnection.HTTP_OK){
//                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                    String inputLine;
//                    StringBuffer response = new StringBuffer();
//                    while ((inputLine = in.readLine()) != null) {
//                        response.append(inputLine);
//                    }
//                    in.close();
//                    if(!response.toString().equals("")){
//                        ArrayList<LocationTracker> tempTrackers = new ArrayList<>();
//                        String[] allData = response.toString().split("!");
//                        for(String allDatum : allData){
//                            String[] types = allDatum.split(",");
//                            int id = Integer.parseInt(types[0]);
//                            int zone = Integer.parseInt(types[1]);
//                            tempTrackers.add(new LocationTracker(id,zone));
//                            //System.out.println(id +"z:"+zone);
//                        }
//                        connection.disconnect();
//                        return tempTrackers;
//                    }
//                }
//            }else{return null;}
//        }catch (Exception e){if(DEBUG){e.printStackTrace();}}
//        return null;
//    }
//    public int updateTrackers(int id){
//        try{
//            URL getURL = new URL(url+"/getLoc?id="+id);
//            if (DEBUG) {System.out.println(getURL);}
//            HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//            connection.setRequestMethod("GET");
//            connection.connect();
//            int responseCode = connection.getResponseCode();
//            if(responseCode == HttpURLConnection.HTTP_OK){
//                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                String inputLine;
//                StringBuffer response = new StringBuffer();
//                while ((inputLine = in.readLine()) != null) {
//                    response.append(inputLine);
//                }
//                in.close();
//                int newZone=-1;
//                if(!response.toString().equals("")){
//                    newZone = Integer.parseInt(response.toString());
//                }
//                connection.disconnect();
//                return newZone;
//
//            }else{return -2;}
//        }catch (Exception e){if(DEBUG){e.printStackTrace();}}
//        return -2;
//    }
//    public int[] getRT(int zone){
//        try{
//            URL getURL = new URL(url + "/getRT?zone=" + zone);
//            if (DEBUG) {System.out.println(getURL);}
//            if(ping(getURL)){
//                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//                connection.setRequestMethod("GET");
//                connection.connect();
//                int responseCode = connection.getResponseCode();
//                if (responseCode == HttpURLConnection.HTTP_OK) {
//                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                    String inputLine;
//                    StringBuffer response = new StringBuffer();
//                    while ((inputLine = in.readLine()) != null) {
//                        response.append(inputLine);
//                    }
//                    in.close();
//                    int[] values = new int[3];
//                    if(DEBUG){System.out.println(response);}
//                    if (!response.toString().equals("")) {
//                        String[] allData = response.toString().split("!");
//                        for (String allDatum : allData) {
//                            String[] types = allDatum.split(",");
//                            values[0] = Integer.parseInt(types[3].split(":")[1]);
//                            values[1] = Integer.parseInt(types[2].split(":")[1]);
//                            values[2] = Integer.parseInt(types[1].split(":")[1]);
//                        }
//                        connection.disconnect();
//                        return values;
//                    }
//                }
//            }else{return null;}
//        }catch (Exception e){if(DEBUG){e.printStackTrace();}}
//        return null;
//    }
//    public synchronized ArrayList<int[]> getZD(int zone){
//        try {
//            URL getURL = new URL(url + "/getZD?zone=" + zone);
//            if (DEBUG) {
//                System.out.println(getURL);
//            }
//            if (ping(getURL)) {
//                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//                connection.setRequestMethod("GET");
//                connection.connect();
//                int responseCode = connection.getResponseCode();
//                if (responseCode == HttpURLConnection.HTTP_OK) {
//                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                    String inputLine;
//                    StringBuilder response = new StringBuilder();
//                    while ((inputLine = in.readLine()) != null) {
//                        response.append(inputLine);
//                    }
//                    in.close();
//                    if (!response.toString().equals("")) {
//                        ArrayList<int[]> records = new ArrayList<>();
//                        String[] allData = response.toString().split("!");
//                        for (int i=0;i<allData.length;i++) {
//                            int[] values = new int[4];
//                            String[] types = allData[i].split(",");
//                            values[0] = Integer.parseInt(types[0].split(":")[1]);
//                            values[1] = Integer.parseInt(types[1].split(":")[1]);
//                            values[2] = Integer.parseInt(types[2].split(":")[1]);
//                            values[3] = Integer.parseInt(types[3].split(":")[1]);
//                            records.add(values);
//                        }
//                        connection.disconnect();
//                        return records;
//                    }
//                }
//            } else {
//                return null;
//            }
//        }catch (Exception e){e.printStackTrace();System.out.println("cant find host");}
//        return null;
//    }
//    public HashMap<String, String> getMD(){
//        try {
//            URL getURL = new URL(url + "/getMD");
//            if (DEBUG) {
//                System.out.println(getURL);
//            }
//            if (ping(getURL)) {
//                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//                connection.setRequestMethod("GET");
//                connection.connect();
//                int responseCode = connection.getResponseCode();
//                if (responseCode == HttpURLConnection.HTTP_OK) {
//                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                    String inputLine;
//                    StringBuilder response = new StringBuilder();
//                    while ((inputLine = in.readLine()) != null) {
//                        response.append(inputLine);
//                    }
//                    in.close();
//                    HashMap<String, String> records = new HashMap<>();
//                    if (!response.toString().equals("")) {
//                        String[] allData = response.toString().split("!");
//                        for (String allDatum : allData) {
//                            String[] types = allDatum.split(",");
//                            records.put(types[0].split("@")[1], types[1].split("@")[1]);
//                        }
//                        if (DEBUG) {
//                            for (int x = 0; x < records.size(); x++) {
//                                System.out.println(records.get(x));
//                            }
//                        }
//                        connection.disconnect();
//                        return records;
//                    }
//                }
//            } else {
//                return null;
//            }
//        }catch (Exception e){e.printStackTrace();System.out.println("cant connect to host");}
//        return null;
//    }
//    public void updateLight(int zone,boolean state, int brightness,boolean ambient){
//        try{
//            URL getURL = new URL(url + "/light?zone="+zone+"&state="+state+"&brightness="+brightness+"&ambient="+ambient);
//            if (ping(getURL)) {
//                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//                connection.setRequestMethod("GET");
//                connection.connect();
//            }
//        }catch (Exception e){}
//    }
//    public boolean ping(URL pingURL) throws IOException {
//        if(DEBUG){System.out.println(pingURL);}
//        HttpURLConnection connection = (HttpURLConnection) pingURL.openConnection();
//        connection.setRequestMethod("GET");
//        try{
//            connection.connect();
//            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
//                return true;
//            }
//        }catch (Exception e){
//            if(DEBUG){
//                System.out.println("failed to connect to host "+pingURL);
//                System.out.println("Server running?");
//            }
//            return false;
//        }
//        return false;
//    }
}
