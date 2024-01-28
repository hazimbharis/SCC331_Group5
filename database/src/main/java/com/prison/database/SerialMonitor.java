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
                if (types.length < 6) {
                    System.out.println(types[0]);
                    int channel = Integer.parseInt(types[0].split(":")[0].trim());
                    int[] values = new int[6];
                    if (channel == 0) {
                        values[0] = Integer.parseInt(types[1].split(":")[1].trim());
                        values[1] = Integer.parseInt(types[2].split(":")[1].trim());
                        values[2] = Integer.parseInt(types[3].split(":")[1].trim());
                        values[3] = Integer.parseInt(types[4].split(":")[1].trim());
                        if (values[0] == 1) {
                            setPing(1);
                            if (hour.compareTo(nextHour) == 1) {
                                nextHour = LocalTime.of(hour.getHour() + 1, hour.getMinute(), hour.getSecond());
                                setZD(1, values[3], values[2], values[1], hour.getHour());
                            }
                            z1counter++;
                            setRT(1, values[3], values[2], values[1], z1counter);
                        }
                        if (values[0] == 2) {
                            System.out.println(hour);
                            System.out.println(nextHour);
                            setPing(2);
                            if (hour.compareTo(nextHour) == 1) {
                                nextHour = LocalTime.of(hour.getHour() + 1, hour.getMinute(), hour.getSecond());
                                setZD(2, values[3], values[2], values[1], hour.getHour());
                            }
                            z2counter++;
                            setRT(2, values[3], values[2], values[1], z2counter);
                        }
                        if (values[0] == 3) {
                            setPing(3);
                            if (hour.compareTo(nextHour) == 1) {
                                nextHour = LocalTime.of(hour.getHour() + 1, hour.getMinute(), hour.getSecond());
                                setZD(3, values[3], values[2], values[1], hour.getHour());
                            }
                            z3counter++;
                            setRT(3, values[3], values[2], values[1], z3counter);
                        }
                        checkRT();
                    } else if (channel == 2) {
                        int id = Integer.parseInt(types[1].split(":")[1].trim()); //people
                        int idINzone = Integer.parseInt(types[2].split(":")[1].trim());
                        boolean check = false;
//                            for (int x = 0; x < trackers.size(); x++) {
//                                if(trackers.get(x).getId() == id) {
//                                    check=true;
//                                    if (trackers.get(x).getZone() != idINzone) {
//                                        trackers.get(x).updateZone(idINzone);
//                                        break;
//                                    }
//                                }
//                            }
                        if (check == false) {
                            //trackers.add(new LocationTracker(id, idINzone));
                        }
                    }
                }
            }



        });
    }

    //old functions will change later

    public void setPing(int zone) {
        try {
            URL getURL = new URL(url + "/setPing?zone=" + zone);
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
        }
    }

    public void setMD(String item) {
        try {
            URL getURL = new URL(url + "/insertMD?item=" + item);
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
            e.printStackTrace();
        }

    }

    public void setZD(int zone, int temp, int noise, int light, int time) {
        try {
            URL getURL = new URL(url + "/insertZD?z=" + zone + "&t=" + temp + "&n=" + noise + "&l=" + light + "&time=" + time);
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

    public void setRT(int zone, int temp, int noise, int light, int counter) {
        try {
            URL getURL = new URL(url + "/insertRT?z=" + zone + "&t=" + temp + "&n=" + noise + "&l=" + light + "&id=" + counter);
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
                                setRT(zoneCount, Integer.parseInt(records.get(records.size() - 1)[1].split(":")[1]),
                                        Integer.parseInt(records.get(records.size() - 1)[2].split(":")[1]),
                                        Integer.parseInt(records.get(records.size() - 1)[3].split(":")[1]), 1);
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
