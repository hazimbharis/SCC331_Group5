package com.monitor.server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Path;
import java.sql.*;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@EnableScheduling
@SpringBootApplication
@RestController
public class ServerApplication {
	private static final String PASSWORD = "SCC330group5";
	private static String URL = "jdbc:mysql://localhost:3306/?useSSL=FALSE&allowPublicKeyRetrieval=True";
	private static final String USER = "java";
	private static Connection connection;
	private static SerialMonitor monitor;
	private static boolean zone1Alive = false;
	private static boolean zone2Alive = false;
	private static boolean zone3Alive = false;
	private static int z1timeout;
	private static int z2timeout;
	private static int z3timeout;
	private static boolean imAlive=false;

	private static final String[] tableNames = {"zone1", "zone2", "zone3", "cup", "motion", "realTime"};
	private static final String[] tableQuery ={
		"temp VARCHAR(100) NOT NULL, noise VARCHAR(100) NOT NULL, light VARCHAR(100) NOT NULL, time INT",
			"temp VARCHAR(100) NOT NULL, noise VARCHAR(100) NOT NULL, light VARCHAR(100) NOT NULL, time INT",
			"temp VARCHAR(100) NOT NULL, noise VARCHAR(100) NOT NULL, light VARCHAR(100) NOT NULL, time INT",
			"timeOfUse timestamp",
			"item text NOT NULL, timeOfUse timestamp",
			"id INT, zone text NOT NULL, temp VARCHAR(100) NOT NULL, noise VARCHAR(100) NOT NULL, light VARCHAR(100) NOT NULL"
	};
	static {
		try {
			connection = DriverManager.getConnection(URL,USER,PASSWORD);
			Statement stmt = connection.createStatement();
			stmt.execute("CREATE DATABASE IF NOT EXISTS Microbits");
			URL = "jdbc:mysql://localhost:3306/Microbits?useSSL=FALSE&allowPublicKeyRetrieval=True";
			connection = DriverManager.getConnection(URL,USER,PASSWORD);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
	public static void main(String[] args) throws Exception {
		String reset = "DROP TABLE IF EXISTS Microbits.Realtime ";
		PreparedStatement stmt2 = connection.prepareStatement(reset);
		stmt2.executeUpdate();
		for(int i=0;i<tableNames.length;i++){
			String make = "CREATE TABLE IF NOT EXISTS "+tableNames[i]+"("+tableQuery[i]+")";
			PreparedStatement stmt = connection.prepareStatement(make);
			stmt.executeUpdate();
		}
		SpringApplication.run(ServerApplication.class, args);
		try{
			Runtime.getRuntime().exec("cmd.exe /c start /min C:/Users/veter/Documents/Uni/softwareEngineering/year3/330/330Group5/Server/src/main/java/com/monitor/server/discord.bat");
		}catch (Exception e){e.printStackTrace();}
		monitor = new SerialMonitor();
		Thread.sleep(1000);
		try{
			monitor.start();
		}catch (Exception e) {
			System.out.println("no Microbit detected");
		}
		imAlive=true;
		ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
		scheduledExecutorService.scheduleAtFixedRate(() -> {
			if(z1timeout>0){
				z1timeout--;
			}if(z2timeout>0){
				z2timeout--;
			}if(z3timeout>0){
				z3timeout--;
			}
			if (z1timeout == 0) {
				zone1Alive=false;
			}
			if (z2timeout == 0) {
				zone2Alive=false;
			}
			if (z3timeout == 0) {
				zone3Alive=false;
			}
		},0,1, TimeUnit.SECONDS);

	}
	@Scheduled(cron = "0 */2 * ? * *")
	private void cleanup(){
		System.out.println("cleaning up");
		monitor.stop();
		monitor=null;
		try{
			monitor= new SerialMonitor();
			monitor.start();
		}catch (Exception e){e.printStackTrace();}
	}
	@GetMapping("/light")
	private void light(@RequestParam(value="zone") int zone,@RequestParam(value="state")boolean onoff,
					   @RequestParam(value="brightness") int brightness, @RequestParam(value="ambient")boolean amb){
		String output="";
		if(zone==1){
			if(onoff) {
				output = "on," + brightness;
			}else if(amb){
				output="amb,0";
			}else{
				output="off,0";
			}
			output="1,"+output;
			monitor.z1light=output;
		}else if(zone==2){
			if(onoff) {
				output = "on," + brightness;
			}else if(amb){
				output="amb,0";
			}else{
				output="off,0";
			}
			output="2,"+output;
			monitor.z2light=output;
		}else if(zone==3){
			if(onoff) {
				output = "on," + brightness;
			}else if(amb){
				output="amb,0";
			}else{
				output="off,0";
			}
			output="3,"+output;
			monitor.z3light=output;
		}
		monitor.updateLights(zone);
	}
	@GetMapping("/insertMD")
	private String insertMotionData(@RequestParam(value = "item") String item) throws SQLException {
		String insertDataSQL = "INSERT INTO motion (item, timeOfUse) VALUES (?, ?)";

		try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
			statement.setString(1, item);
			statement.setTimestamp(2, new java.sql.Timestamp(new java.util.Date().getTime()));
			statement.executeUpdate();
		}
		return "Created?";
	}
	@GetMapping("/setPing")
	private void setPing(@RequestParam(value = "zone") int zone){
		if(zone==1){
			z1timeout=5;
			zone1Alive=true;
		}if(zone==2){
			z2timeout=5;
			zone2Alive=true;
		}if(zone==3){
			z3timeout=5;
			zone3Alive=true;
		}
	}
	@GetMapping("/ping")
	private boolean ping(@RequestParam(value="zone")int zone){
		if(zone==1){
			return zone1Alive;
		}else if(zone==2){
			return zone2Alive;
		}else if(zone==3){
			return zone3Alive;
		}else{
			return false;
		}
	}
	@GetMapping("/pingMe")
	private boolean pingMe(){
		return imAlive;
	}
	@GetMapping("/insertZD")
	private String insertZoneData(@RequestParam(value = "z") int zone,
	@RequestParam(value="t")int temp,
	@RequestParam(value="n")int noise,
	@RequestParam(value="l")int light,
	@RequestParam(value="time")int time) throws SQLException {
		String insertDataSQL="INSERT INTO zone1 (temp,noise,light,time) VALUES (? ?,?,?)";
		if(zone==1){
			insertDataSQL = "INSERT INTO zone1 (temp,noise,light,time) VALUES (?, ?,?,?)";
		} else if (zone==2) {
			insertDataSQL = "INSERT INTO zone2 (temp,noise,light,time) VALUES (?, ?,?,?)";
		}else if (zone==3) {
			insertDataSQL = "INSERT INTO zone3 (temp,noise,light,time) VALUES (?, ?,?,?)";
		}
		try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
			statement.setString(1, String.valueOf(temp));
			statement.setString(2, String.valueOf(noise));
			statement.setString(3, String.valueOf(light));
			statement.setString(4, String.valueOf(time));
			statement.executeUpdate();
		}
		return "added to zone"+zone;
	}
	@GetMapping("/insertRT")
	private String insertRealTime(@RequestParam(value = "z") int zone,
	@RequestParam(value="t")int temp,
	@RequestParam(value="n")int noise,
	@RequestParam(value="l")int light,
	@RequestParam(value="id")int id) throws SQLException {
		String insertDataSQL="INSERT INTO realTime (id,zone,temp,noise,light) VALUES (?,?,?,?,?)";
		try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
			statement.setString(1, String.valueOf(id));
			statement.setString(2, String.valueOf(zone));
			statement.setString(3, String.valueOf(temp));
			statement.setString(4, String.valueOf(noise));
			statement.setString(5, String.valueOf(light));
			statement.executeUpdate();
		}
		return "added to realtime"+zone;
	}

	@GetMapping("/getZD")
	private String getZD(@RequestParam(value = "zone")int zone) throws SQLException{
		String make = "SELECT * FROM Microbits.zone"+zone;
		PreparedStatement stmt = connection.prepareStatement(make);
		ResultSet result = stmt.executeQuery();
		String output = "";
		while (result.next()){
			String temp = "temp:"+result.getString("temp");
			String noise= "noise:"+result.getString("noise");
			String light= "light:"+result.getString("light");
			String time = "time:"+result.getString("time");
			output = output.concat(String.join(",",temp,noise,light,time)+"!");
		}
		return output;
	}
	@GetMapping("/addPerson")
	private void addp(@RequestParam(value = "id")int id,@RequestParam(value = "zone") int zone){
		monitor.getTrackers().add(new LocationTracker(id,zone));
	}
	@GetMapping("/getAllLocs")
	private String getAllLocs(){
		String all = "";
		for (int x = 0; x < monitor.getTrackers().size(); x++) {
			all = all.concat(String.join(",", String.valueOf(monitor.getTrackers().get(x).getId()),
					String.valueOf(monitor.getTrackers().get(x).getZone())) + "!");
		}
		return all;
	}
	@GetMapping("/getLoc")
	private String getLoc(@RequestParam(value = "id")int id){
		String output="";
		for (int x = 0; x < monitor.getTrackers().size(); x++) {
			if(monitor.getTrackers().get(x).getId()==id){
				output= String.valueOf(monitor.getTrackers().get(x).getZone());
			}
		}
		return output;
	}
	@GetMapping("/getCup")
	private String getCup(){
		String output = String.join(",",String.valueOf(monitor.getCup().getTilt()),
				String.valueOf(monitor.getCup().getPercent()));
		//System.out.println(output);
		return output;
	}
	@GetMapping("/getRT")
	private String getRT(@RequestParam(value = "zone")int zone) throws SQLException{
		String make = "SELECT * FROM Microbits.realTime WHERE zone="+zone;
		PreparedStatement stmt = connection.prepareStatement(make);
		ResultSet result = stmt.executeQuery();
		String output = "";
		while (result.next()){
			int id = result.getInt("id");
			String temp = "temp:"+result.getString("temp");
			String noise= "noise:"+result.getString("noise");
			String light= "light:"+result.getString("light");
			output = output.concat(String.join(",",String.valueOf(id),temp,noise,light)+"!");
		}
		return output;
	}
	@GetMapping("/updateRT")
	private void updateRT(@RequestParam(value = "zone")int zone) throws SQLException{
		String make = "delete from Microbits.realTime";
		PreparedStatement stmt = connection.prepareStatement(make);
		stmt.executeUpdate();
	}
	@GetMapping("/getMD")
	private String retrieveMotionData(@RequestParam(value = "item", defaultValue = "all")String item) throws SQLException {
		String retrieveDataSQL;
		if(item.equals("all")){
			retrieveDataSQL= "SELECT * FROM Microbits.motion";
		}else{
			retrieveDataSQL = "SELECT * FROM Microbits.motion WHERE motion.item = '"+item+"'";
		}

		PreparedStatement statement = connection.prepareStatement(retrieveDataSQL);
		ResultSet result = statement.executeQuery();
		String output="";
			while (result.next()) {

				output = output+"item@"+result.getString("item")+",Time used@"+
						result.getTimestamp("timeOfUse").toString()+"!";
			}

		return output;
	}
	@GetMapping("/setup")
	private void webSetup() throws SQLException {
		for (int i = 0; i < tableNames.length; i++) {
			String make = "CREATE TABLE IF NOT EXISTS " + tableNames[i] + "(" + tableQuery[i] + ")";
			PreparedStatement stmt = connection.prepareStatement(make);
			stmt.executeUpdate();
		}
	}
	@GetMapping("/reset")
	private String reset() throws SQLException {
		for (int i = 0; i < tableNames.length; i++) {
			String drop = "DROP TABLE IF EXISTS Microbits." + tableNames[i];
			PreparedStatement stmt = connection.prepareStatement(drop);
			stmt.executeUpdate();
		}
		return "all tables dropped";
	}
}
