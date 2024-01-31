package com.prison.database;

import com.fazecast.jSerialComm.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;

public class SerialMonitor {
    private boolean DEBUG = true;
    private URL url = new URL("http://localhost:8080");
    private LocalTime hour = LocalTime.now();
    private LocalTime nextHour = LocalTime.now().plusSeconds(10);//LocalTime.of(hour.getHour()+1,hour.getMinute(),hour.getSecond());
    private SerialPort microbit;

    //unnecessary variables, will remove later
    private int z1counter;
    private int z2counter;
    private int z3counter;
    //private ArrayList<LocationTracker> trackers = new ArrayList<>();


    public SerialMonitor() throws MalformedURLException {
    }

    public void start() throws Exception {
        /*
         *         IF YOU GET AN IMPORT ERROR
         *   File > project structure > libraries > click the + sign
         *   Add from Maven, search for "JSerialComm"
         *   Add the one from "fazecast"
         *   Add to Monitor, NOT application
         *   This should add the required dependency  */

        // List all the ports available
        if (DEBUG) {
            for (SerialPort s : SerialPort.getCommPorts()) {
                System.out.println("Serial Port: " + s.getDescriptivePortName());
            }
        }


        // Get the appropriate port and open
        microbit = SerialPort.getCommPort("COM6");
        microbit.openPort();
        // Set the baud rate
        if (microbit.isOpen()) {
            if (DEBUG) {
                System.out.println("Initializing...");
            }
            microbit.setBaudRate(115200);
        } else {
            if (DEBUG) {
                System.out.println("Port not found");
            }
            throw new Exception("no port");
        }

        // Add data listener to the SerialPort
        microbit.addDataListener(new SerialPortMessageListener() {

            @Override
            public int getListeningEvents() {
                return SerialPort.LISTENING_EVENT_DATA_RECEIVED;
            }

            @Override
            public byte[] getMessageDelimiter() {
                return new byte[]{System.getProperty("line.separator").getBytes()[0]};
            }

            @Override
            public boolean delimiterIndicatesEndOfMessage() {
                return true;
            }

            @Override
            public void serialEvent(SerialPortEvent event) {
                System.out.println("received");
                hour = LocalTime.now();
                byte[] delimitedMessage = event.getReceivedData();
                String data = new String(delimitedMessage);
                if (DEBUG) {
                    System.out.println(data);
                }
                String[] types = data.split(",");
                if (types.length < 16) { //don't know why this is here
                    System.out.println("channel type: " + types[0]);
                    String channel = types[0].split(":")[0].trim();
                    System.out.println(channel);
                    int[] values = new int[6];
                    switch (channel) {
                        case "001" -> {  // environment response data
                            String prisonerID = types[1]; // prisoner ID}
                            int zoneID = Integer.parseInt(types[2]); // zone ID
                            setPrisoner(prisonerID, zoneID);
                        }
                        case "002" -> {  // door response data
                            System.out.println(types[1]); //door ID
                            System.out.println(types[2]); //locked status
                            System.out.println(types[3]); //closed status
                            System.out.println(types[4]); //alarmed status

                            int doorID = Integer.parseInt(types[1]);
                            boolean locked = Boolean.parseBoolean(types[2]);
                            boolean closed = Boolean.parseBoolean(types[3]);
                            boolean alarm = Boolean.parseBoolean(types[4]);

                            setDoor(doorID, locked, closed, alarm);
                        }
                        case "003" -> { // environment response data
                            System.out.println(types[1]); //zone ID
                            System.out.println(types[2]); //temp
                            System.out.println(types[3]); //noise
                            System.out.println(types[4]); //light

                            int zoneID = Integer.parseInt(types[1]);
                            int temp = Integer.parseInt(types[2]);
                            int noise = Integer.parseInt(types[3]);
                            int light = Integer.parseInt(types[4]);

                            setEnvironment(zoneID, temp, noise, light);
                        }

                    }
                }
            }



        });
    }

    public void setPrisoner(String pid, int zid) {
        try {
            URL getURL = new URL(url + "/addPrisoner?id=" + pid + "&zone=" + zid);
            HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            int responseCode = connection.getResponseCode();
            if (DEBUG) {
                System.out.println(getURL);
                System.out.println(responseCode);
            }
            connection.disconnect();

        } catch (Exception e) {
            System.out.println("failed to connect");
        }
    }
    public void setDoor(int did, boolean locked, boolean closed, boolean alarm) {
        try {
            URL getURL = new URL(url + "/addDoor?door=" + did + "&locked=" + locked + "&closed=" + closed + "&alarm=" + alarm);
            HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            int responseCode = connection.getResponseCode();
            if (DEBUG) {
                System.out.println(getURL);
                System.out.println(responseCode);
            }
            connection.disconnect();

        } catch (Exception e) {
            System.out.println("failed to connect");
        }
    }
    public void setEnvironment(int zid, int temp, int noise, int light) {
        try {
            URL getURL = new URL(url + "/addEnvironment?zone=" + zid + "&temp=" + temp + "&noise=" + noise + "&light=" + light);
            HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            int responseCode = connection.getResponseCode();
            if (DEBUG) {
                System.out.println(getURL);
                System.out.println(responseCode);
            }
            connection.disconnect();

        } catch (Exception e) {
            System.out.println("failed to connect");
        }
    }

    //old functions will change later

//    public void setPing(int zone) {
//        try {
//            URL getURL = new URL(url + "/setPing?zone=" + zone);
//            HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
//            connection.setRequestMethod("GET");
//            connection.connect();
//            int responseCode = connection.getResponseCode();
//            if (DEBUG) {
//                System.out.println(getURL);
//                System.out.println(responseCode);
//            }
//            connection.disconnect();
//        } catch (Exception e) {
//        }
//    }

    public void checkRT() {
        try {
            for (int zoneCount = 1; zoneCount < 4; zoneCount++) {
                URL getURL = new URL(url + "/getRT?zone=" + zoneCount);
                if (DEBUG) {
                    System.out.println(getURL);
                }
                HttpURLConnection connection = (HttpURLConnection) getURL.openConnection();
                connection.setRequestMethod("GET");
                connection.connect();
                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    String[] entries = response.toString().split("!");
                    ArrayList<String[]> records = new ArrayList<String[]>();
                    for (int a = 0; a < entries.length; a++) {
                        records.add(entries[a].split(","));
                    }
                    in.close();
                    if (!response.toString().equals("")) {
                        if (Integer.valueOf(records.get(records.size() - 1)[0]) > 10) {
                            URL update = new URL(url + "/updateRT?zone=" + zoneCount);
                            HttpURLConnection conn = (HttpURLConnection) update.openConnection();
                            conn.setRequestMethod("GET");
                            conn.connect();
                            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                                if (zoneCount == 1) {
                                    z1counter = 1;
                                } else if (zoneCount == 2) {
                                    z2counter = 1;
                                } else if (zoneCount == 3) {
                                    z3counter = 1;
                                }
                            }
                            connection.disconnect();
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        microbit.closePort();
    }
}

//    public ArrayList<LocationTracker> getTrackers(){
//        return trackers;
//    }
// }
