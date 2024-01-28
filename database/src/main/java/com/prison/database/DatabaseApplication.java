package com.prison.database;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.MalformedURLException;
import java.sql.*;

@SpringBootApplication
public class DatabaseApplication {
	// Login variables
	private static final String PASSWORD = "MyNewPass";
	private static String URL = "jdbc:mysql://localhost:3306/?useSSL=FALSE&allowPublicKeyRetrieval=True";
	private static final String USER = "root";
	private static Connection connection;

	// Database variables
	private static final String[] tableNames = {"movement","lockstatus"};
	private static final String[] tableQuery ={
			"prisonerID VARCHAR(100) PRIMARY KEY NOT NULL, zoneID INT NOT NULL",
			"doorID INT PRIMARY KEY, locked BOOL NOT NULL, closed BOOL NOT NULL, alarm BOOL NOT NULL"
	};

	// Microbit variables
	private static SerialMonitor monitor;


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

	public static void main(String[] args) throws SQLException, MalformedURLException {
		initialize();
		SpringApplication.run(DatabaseApplication.class, args);
		monitor = new SerialMonitor();

		try {
			monitor.start();
		} catch (Exception e) {
			System.out.println("no microbit detected");
		}

	}

	//http://localhost:8080/addPrisoner?id=1&zone=1
	@GetMapping("/addPrisoner")
	private void addp(@RequestParam(value = "id")String id, @RequestParam(value = "zone") int zone) throws SQLException {

		/***
		 * parameters: prisoner id (varchar), zone id (int: 1-4)
		 *
		 * when insert, check if ID exists
		 * -> "SELECT * FROM Microbits.movement WHERE movement.item = '"+item+"'";
		 * if true, set value of current id
		 * if false, create new row
		 */

		// if 0, adds new prisoner entry
		// if 1, changes value of prisoner entry
		int check = 0;
		String insertDataSQL;
		ResultSet result;

		String retrieveDataSQL = "SELECT COUNT(*) FROM Microbits.movement WHERE movement.prisonerID = '"+id+"'";
		try (PreparedStatement statement = connection.prepareStatement(retrieveDataSQL)) {
			result = statement.executeQuery();

		}

		if (result.getInt(0) == 0) {
			insertDataSQL="INSERT INTO movement (id,zone) VALUES (?,?)";
			try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
				statement.setString(1, String.valueOf(id));
				statement.setString(2, String.valueOf(zone));
				statement.executeUpdate();
			}
		} else if (result.getInt(0) == 1) {
			insertDataSQL="UPDATE movement SET zoneID = " + zone + "WHERE prisonerID = '" + id + "'";
			try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
				statement.executeUpdate();
			}
		}
	}

	//start of oldcode

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

	@GetMapping("/insertMD")
	private String insertMotionData(@RequestParam(value = "item") String item) throws SQLException {
		String insertDataSQL = "INSERT INTO movement (item, timeOfUse) VALUES (?, ?)";

		try (PreparedStatement statement = connection.prepareStatement(insertDataSQL)) {
			statement.setString(1, item);
			statement.setTimestamp(2, new java.sql.Timestamp(new java.util.Date().getTime()));
			statement.executeUpdate();
		}
		return "Created?";
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

	@GetMapping("/getMD")
	private String retrieveMotionData(@RequestParam(value = "item", defaultValue = "all")String item) throws SQLException {
		String retrieveDataSQL;
		if(item.equals("all")){
			retrieveDataSQL= "SELECT * FROM Microbits.movement";
		}else{
			retrieveDataSQL = "SELECT * FROM Microbits.movement WHERE movement.item = '"+item+"'";
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

	// end of old code

	private static void initialize() throws SQLException {
		String reset = "DROP TABLE IF EXISTS Microbits.Realtime ";
		PreparedStatement stmt2 = connection.prepareStatement(reset);
		stmt2.executeUpdate();
		for(int i=0;i<tableNames.length;i++){
			String make = "CREATE TABLE IF NOT EXISTS "+tableNames[i]+"("+tableQuery[i]+")";
			PreparedStatement stmt = connection.prepareStatement(make);
			stmt.executeUpdate();
		}
	}
}
