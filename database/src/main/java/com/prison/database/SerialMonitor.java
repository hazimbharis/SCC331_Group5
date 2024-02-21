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
    private int zones = 4;
    private double [][] prevZoneValues = new double[zones][3]; //Stores previous zone values as zone history only stores changes so needed for comparison
    private int doors = 4;
    private String[] prevDoorValues = new String[doors];

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

        for (int i = 0; i < zones; i ++) {
            for (int j = 0; j < 3; j++) {
                prevZoneValues[i][j] = 0; //Initialise array
            }
        }
        for (int i = 0; i < doors; i ++) {
            prevDoorValues[i] = "none";
        }

        // List all the ports available
        if (DEBUG) {
            for (SerialPort s : SerialPort.getCommPorts()) {
                System.out.println("Serial Port: " + s.getDescriptivePortName());
            }
        }


        // Get the appropriate port and open
        microbit = SerialPort.getCommPort("COM3");
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

                            boolean locked;
                            boolean closed;
                            boolean alarm;

                            if (types[2].equals("0")) {
                                locked = false;
                            } else {
                                locked = true;
                            }

                            if (types[3].equals("0")) {
                                closed = false;
                            } else {
                                closed = true;
                            }

                            if (types[4].equals("0")) {
                                alarm = false;
                            } else {
                                alarm = true;
                            }



                            int doorID = Integer.parseInt(types[1]);

                            setDoor(doorID, locked, closed, alarm);

                            //alarm check

                        }
                        case "003" -> { // environment response data
                            System.out.println(types[1]); //zone ID
                            System.out.println(types[2]); //temp
                            System.out.println(types[3]); //noise
                            System.out.println(types[4]); //light

                            int zoneID = Integer.parseInt(types[1]);
                            int temp = Integer.parseInt(types[2]);
                            int noise = Integer.parseInt(types[3]);
                            double light = Double.parseDouble(types[4]);

                            setEnvironment(zoneID, temp, noise, light);

                            //temp check
                            if (temp > 100) setWarning(zoneID, 2);
                            if (temp < 0) setWarning(zoneID, 3);
                            //noise check
                            if (noise > 100) setWarning(zoneID, 4);
                            //light check
                            if (noise > 100) setWarning(zoneID, 4);

                        }
                        case "004"-> { // help signal from guard microbit
                            String forcelock = "FORCELOCK";
                            byte[] msg = forcelock.getBytes();


                            int zoneID = Integer.parseInt(types[1]);
                            //not sure how to store this data, can make the warnings table store guard IDs (int to varchar)


                            //central microbit sends a message which all doors will be waiting to hear
                            microbit.writeBytes(msg, msg.length);

                            // some extra code to send to frontend that there is an alert
                            setWarning(zoneID, 1);
                            // maybe set an alert value in column in mysql table
                            // frontend will have to have a display thing for it

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
            String status;
            if (alarm == true) {
                status = "alarm";
            }
            else if (locked == true) {
                status = "locked";
            }
            else if (closed == true) {
                status = "closed";
            }
            else {
                status = "open";
            }
            if (status.equals(prevDoorValues[did]) == false) {
                URL dHURL = new URL(url + "/addDoorHistory?door=" + did + "&status=" + status);
                HttpURLConnection conn = (HttpURLConnection) dHURL.openConnection();
                conn.setRequestMethod("GET");
                conn.connect();
                int resCode = conn.getResponseCode();
                if (DEBUG) {
                    System.out.println(dHURL);
                    System.out.println(resCode);
                }
                connection.disconnect();
                prevDoorValues[did] = status;
            }

        } catch (Exception e) {
            System.out.println("failed to connect");
        }
    }
    public void setEnvironment(int zid, int temp, int noise, double light) {
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
            if (prevZoneValues[zid][0] != temp || prevZoneValues[zid][1] != noise || prevZoneValues[zid][2] != light) { //Add new zone history entry if any value has changed from its previous value
                URL zHURL = new URL(url + "/addZoneHistory?zone=" + zid + "&temp=" + temp + "&noise=" + noise + "&light=" + light);
                HttpURLConnection conn = (HttpURLConnection) zHURL.openConnection();
                conn.setRequestMethod("GET");
                conn.connect();
                int resCode = conn.getResponseCode();
                if (DEBUG) {
                    System.out.println(zHURL);
                    System.out.println(resCode);
                }
                connection.disconnect();
                prevZoneValues[zid][0] = temp;
                prevZoneValues[zid][1] = noise;
                prevZoneValues[zid][2] = light;
            }

        } catch (Exception e) {
            System.out.println("failed to connect");
        }
    }

    public void setWarning(int zid, int wid) {
        try {
            URL getURL = new URL(url + "/addWarning?zone=" + zid + "&warning=" + wid);
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
