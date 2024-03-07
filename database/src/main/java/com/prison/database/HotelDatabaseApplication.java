package com.prison.database;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
@RestController
public class HotelDatabaseApplication {
	// things to do
	// change all references to Microbits
	// change all query references


	// Login variables

	private static final String PASSWORD = "MyNewPass";
	private static String URL = "jdbc:mysql://localhost:3306/?useSSL=FALSE&allowPublicKeyRetrieval=True";
	private static final String USER = "root";
	private static Connection connection;

	// Database variables
	private static final String[] tableNames = {"lockstatus","environment","users", "guests", "staff", "visitors", "movement", "history", "warnings", "zonehistory", "doorhistory"};
	private static final String[] tableQuery ={
			"doorID INT PRIMARY KEY, locked BOOL NOT NULL, closed BOOL NOT NULL, alarm BOOL NOT NULL",
			"zoneID INT PRIMARY KEY NOT NULL, temp VARCHAR(100) NOT NULL, noise VARCHAR(100) NOT NULL, light VARCHAR(100) NOT NULL",
			"id VARCHAR(20) PRIMARY KEY NOT NULL, firstNames VARCHAR(50) NOT NULL, lastName VARCHAR(50) NOT NULL, dob DATE NOT NULL, gender VARCHAR(10) NOT NULL, medicalConditions VARCHAR(100), type CHAR NOT NULL",
			"id VARCHAR(20) PRIMARY KEY NOT NULL, roomType VARCHAR(100) NOT NULL, startDate DATE NOT NULL, endDate DATE, FOREIGN KEY (id) REFERENCES users(id)",
			"id VARCHAR(20) PRIMARY KEY NOT NULL, role VARCHAR(20) NOT NULL, FOREIGN KEY (id) REFERENCES users(id)",
			"id VARCHAR(20) PRIMARY KEY NOT NULL, phoneNo VARCHAR(11) NOT NULL, FOREIGN KEY (id) REFERENCES users(id)",
			"guestID VARCHAR(100) NOT NULL, zoneID INT NOT NULL, timeStamp TIMESTAMP(3) NOT NULL, FOREIGN KEY (guestID) REFERENCES users(id)",
			"id VARCHAR(100) PRIMARY KEY NOT NULL, zoneID INT NOT NULL, timeOfUse timestamp, FOREIGN KEY (id) REFERENCES users(id)",
			"zoneID INT NOT NULL, warningID INT NOT NULL", // zone where warning occuring, type of warning: 1 staff assist, 2 temp, 3 temp, 4 noise, 5 light
			"zoneID INT NOT NULL, temp INT NOT NULL, noise INT NOT NULL, light DOUBLE(7,2) NOT NULL, date DATE NOT NULL, time TIME NOT NULL, PRIMARY KEY(zoneID, date, time)",
			"doorID INT NOT NULL, status VARCHAR(20) NOT NULL, date DATE NOT NULL, time TIME NOT NULL, FOREIGN KEY (doorID) REFERENCES lockstatus(doorID), PRIMARY KEY(doorID, date, time)"
	};

	// Microbit variables
	private static SerialMonitor monitor;


	static {
		try {
			connection = DriverManager.getConnection(URL,USER,PASSWORD);
			Statement stmt = connection.createStatement();
			stmt.execute("CREATE DATABASE IF NOT EXISTS Hotel");
			URL = "jdbc:mysql://localhost:3306/Hotel?useSSL=FALSE&allowPublicKeyRetrieval=True";
			connection = DriverManager.getConnection(URL,USER,PASSWORD);
		} catch (SQLException e) {
			throw new RuntimeException(e);
	}
}

	public static void main(String[] args) throws SQLException, MalformedURLException {
		initialize();
		SpringApplication.run(HotelDatabaseApplication.class, args);
		monitor = new SerialMonitor();

		try {
			monitor.start();
		} catch (Exception e) {
			System.out.println("no microbit detected");
		}
	}

	private static void initialize() throws SQLException {
		String reset = "DROP TABLE IF EXISTS Hotel.Realtime ";
		PreparedStatement stmt2 = connection.prepareStatement(reset);
		stmt2.executeUpdate();
		for(int i=0;i<tableNames.length;i++){
			String make = "CREATE TABLE IF NOT EXISTS "+tableNames[i]+"("+tableQuery[i]+")";
			PreparedStatement stmt = connection.prepareStatement(make);
			stmt.executeUpdate();
		}
	}

	//http://localhost:8080/addPrisoner?id=AAAAAAA&zone=1
	/*
	 * 

	 
	 */
	@GetMapping("/addGuest")
	private void addPrisoner(@RequestParam(value = "id")String id, @RequestParam(value = "zone") int zone) throws SQLException {

		/*
		 * parameters: prisoner id (varchar), zone id (int: 1-4)
		 *
		 * when insert, check if ID exists
		 * -> "SELECT * FROM Microbits.movement WHERE movement.item = '"+item+"'";
		 * if true, set value of current id
		 * if false, create new row
		 */
		// if 0, adds new prisoner entry
		// if 1, changes value of existing prisoner entry
		int check = 0;
		String insertDataSQL;
		ResultSet result;

		String retrieveDataSQL = "SELECT COUNT(*) FROM Hotel.movement WHERE movement.guests = '"+id+"'";
		try (PreparedStatement statement = connection.prepareStatement(retrieveDataSQL)) {
			result = statement.executeQuery();
			while (result.next()) {
				check = result.getInt(1);
			}
			if (check == 0) {
				insertDataSQL="INSERT INTO movement (guestID,zoneID) VALUES (?,?)";
				try (PreparedStatement statement1 = connection.prepareStatement(insertDataSQL)) {
					statement1.setString(1, String.valueOf(id));
					statement1.setString(2, String.valueOf(zone));
					statement1.executeUpdate();
				}
			} else if (check == 1) {
				insertDataSQL="UPDATE movement SET zoneID = " + zone + " WHERE guestID = '" + id + "'";
				try (PreparedStatement statement2 = connection.prepareStatement(insertDataSQL)) {
					statement2.executeUpdate();
				}
			}
		}
	}

		//http://localhost:8080/addPrisoner?id=AAAAAAA&zone=1
	@GetMapping("/movementTime")
	private void addPrisoner2(@RequestParam(value = "id")String id, @RequestParam(value = "zone") int zone) throws SQLException {

		/*
		 * parameters: prisoner id (varchar), zone id (int: 1-4)
		 *
		 * when insert, check if ID exists
		 * -> "SELECT * FROM Microbits.movement WHERE movement.item = '"+item+"'";
		 * if true, set value of current id
		 * if false, create new row
		 */

		// if 0, adds new prisoner entry
		// if 1, changes value of existing prisoner entry
		String insertDataSQL;

		insertDataSQL="INSERT INTO movement (guestID,zoneID, timeStamp) VALUES (?,?,?)";
		try (PreparedStatement statement1 = connection.prepareStatement(insertDataSQL)) {
			statement1.setString(1, String.valueOf(id));
			statement1.setString(2, String.valueOf(zone));
			LocalDateTime myDateObj = LocalDateTime.now();
			DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.ms");
			String formattedDate = myDateObj.format(myFormatObj);
			System.out.println("After formatting: " + formattedDate);
			statement1.setString(3, formattedDate);
			statement1.executeUpdate();
		}
	}

	//http://localhost:8080/addDoor?door=1&locked=false&closed=false&alarm=false
	@GetMapping("/addDoor")
	private void addDoor(@RequestParam(value = "door") int door,
								  @RequestParam(value= "locked")boolean locked,
								  @RequestParam(value= "closed")boolean closed,
								  @RequestParam(value= "alarm")boolean alarm) throws SQLException {
		int check = 0;
		String insertDataSQL;
		ResultSet result;

		String retrieveDataSQL = "SELECT COUNT(*) FROM Hotel.lockstatus WHERE lockstatus.doorID = " + door;
		try (PreparedStatement statement = connection.prepareStatement(retrieveDataSQL)) {
			result = statement.executeQuery();
			while (result.next()) {
				check = result.getInt(1); //checks if records exists
			}

			if (check == 0) {
				insertDataSQL="INSERT INTO lockstatus (doorID,locked,closed,alarm) VALUES (?,?,?,?)";
				try (PreparedStatement statement1 = connection.prepareStatement(insertDataSQL)) {
					statement1.setInt(1, door);
					statement1.setBoolean(2, locked);
					statement1.setBoolean(3, closed);
					statement1.setBoolean(4, alarm);
					statement1.executeUpdate();
				}
			} else if (check == 1) {
				insertDataSQL= "UPDATE lockstatus SET locked = " + locked +", closed = " + closed +", alarm = " + alarm + " WHERE doorID = " + door ;
				try (PreparedStatement statement2 = connection.prepareStatement(insertDataSQL)) {
					statement2.executeUpdate();
				}
			}
		}
	}

	//http://localhost:8080/addEnvironment?zone=1&temp=100&noise=24&light=0
	@GetMapping("/addEnvironment")
	private void addEnvironment(@RequestParam(value = "zone") int zone,
						   @RequestParam(value= "temp")int temp,
						   @RequestParam(value= "noise")int noise,
						   @RequestParam(value= "light")double light) throws SQLException {
		int check = 0;
		String insertDataSQL;
		ResultSet result;

		String retrieveDataSQL = "SELECT COUNT(*) FROM Hotel.environment WHERE environment.zoneID = " + zone;

		try (PreparedStatement statement = connection.prepareStatement(retrieveDataSQL)) {
			result = statement.executeQuery();
			while (result.next()) {
				check = result.getInt(1); // checks if a record exists
			}

			if (check == 0) {
				insertDataSQL="INSERT INTO environment (zoneID,temp,noise,light) VALUES (?,?,?,?)";
				try (PreparedStatement statement1 = connection.prepareStatement(insertDataSQL)) {
					statement1.setString(1, String.valueOf(zone));
					statement1.setString(2, String.valueOf(temp));
					statement1.setString(3, String.valueOf(noise));
					statement1.setString(4, String.valueOf(light));
					statement1.executeUpdate();
				}
			} else if (check == 1) {
				insertDataSQL= "UPDATE environment SET temp = " + temp +", noise =" + noise +", light =" + light + " WHERE zoneID = " + zone ;
				try (PreparedStatement statement2 = connection.prepareStatement(insertDataSQL)) {
					statement2.executeUpdate();
				}
			}
		}
	}

	@GetMapping("/addWarning")
	private void addWarning(@RequestParam(value = "zone") int zone,
								@RequestParam(value= "warning")int warning) throws SQLException {
		int check = 0;
		String insertDataSQL;
		ResultSet result;

		String retrieveDataSQL = "SELECT COUNT(*) FROM Hotel.warnings WHERE warnings.zoneID = " + zone + " AND warnings.warningID = " + warning;
		try (PreparedStatement statement = connection.prepareStatement(retrieveDataSQL)) {
			result = statement.executeQuery();
			while (result.next()) {
				check = result.getInt(1); // checks if a record exists
			}

			if (check == 0) {
				insertDataSQL="INSERT INTO warnings (zoneID,warningID) VALUES (?,?)";
				try (PreparedStatement statement1 = connection.prepareStatement(insertDataSQL)) {
					statement1.setString(1, String.valueOf(zone));
					statement1.setString(2, String.valueOf(warning));
					statement1.executeUpdate();
				}
			} else if (check == 1) {
				// don't run any statements - specific warning for that specific zone already exists

				// insertDataSQL= "UPDATE warnings SET warningID = " + warning + " WHERE zoneID = " + zone ;
				// try (PreparedStatement statement2 = connection.prepareStatement(insertDataSQL)) {
				//	statement2.executeUpdate();
				// }
			}
		}
	}

	@GetMapping("/addZoneHistory")
	private void addZoneHistory(@RequestParam(value = "zone") int zone,
								@RequestParam(value= "temp") int temp,
								@RequestParam(value= "noise") int noise,
								@RequestParam(value= "light") double light) throws SQLException {
		LocalDateTime datetime = LocalDateTime.now();
		DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd"); //Get the current time and date
		DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm:ss");
		String date = datetime.format(dateFormat);
		String time = datetime.format(timeFormat);
		String iStatement = "INSERT INTO Hotel.zonehistory (zoneID, temp, noise, light, date, time) VALUES (?, ?, ?, ? ,?, ?)";
		try (PreparedStatement pStatement = connection.prepareStatement(iStatement)) {
			pStatement.setInt(1, zone);
			pStatement.setInt(2, temp);
			pStatement.setInt(3, noise);
			pStatement.setDouble(4, light);
			pStatement.setString(5, date);
			pStatement.setString(6, time);
			pStatement.executeUpdate();
		} catch (Exception e) {
			//In case it tries to add an entry with the same zone, time and date, do nothing
		}
	}

	@GetMapping("/addDoorHistory")
	private void addDoorHistory(@RequestParam(value = "door") int door,
								@RequestParam(value = "status") String status) throws SQLException {
		LocalDateTime datetime = LocalDateTime.now();
		DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd"); //Get the current time and date
		DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("HH:mm:ss");
		String date = datetime.format(dateFormat);
		String time = datetime.format(timeFormat);
		String iStatement = "INSERT INTO Hotel.doorhistory (doorID, status, date, time) VALUES (?, ?, ?, ?)";
		try (PreparedStatement pStatement = connection.prepareStatement(iStatement)) {
			pStatement.setInt(1, door);
			pStatement.setString(2, status);
			pStatement.setString(3, date);
			pStatement.setString(4, time);
			pStatement.executeUpdate();
		} catch (Exception e) {
			//In case it tries to add an entry with the same zone, time and date, do nothing
		}
	}

	//http://localhost:8080/getPrisoners?zone=1
	@GetMapping("/getPrisoners")
	private String getPrisoners(@RequestParam(value = "zone")int zone) throws  SQLException {
		String make = "SELECT * FROM Hotel.movement WHERE zoneID = " +zone;
		PreparedStatement stmt = connection.prepareStatement(make);
		ResultSet result = stmt.executeQuery();
		String output = "";
		while (result.next()){
			String id = "guestID:"+result.getString("guestID");
			output = output.concat(String.join(",",id)+"!");
		}
		return output;
	}

	//http://localhost:8080/getDoors
	@GetMapping("/getDoors")
	private String getDoors() throws  SQLException {
		String make = "SELECT * FROM Hotel.lockstatus";
		PreparedStatement stmt = connection.prepareStatement(make);
		ResultSet result = stmt.executeQuery();
		String output = "";
		while (result.next()){
			String door = "doorID:"+result.getString("doorID");
			String locked = "locked:"+result.getString("locked");
			String closed = "closed:"+result.getString("closed");
			String alarm = "alarm:"+result.getString("alarm");
			output = output.concat(String.join(",",door,locked,closed,alarm)+"!");
		}
		return output;
	}

	//http://localhost:8080/getEnvironment?zone=1
	@GetMapping("/getEnvironment")
	private String getEnvironment(@RequestParam(value = "zone")int zone) throws  SQLException {
		String make = "SELECT * FROM Hotel.environment WHERE zoneID = " +zone;
		PreparedStatement stmt = connection.prepareStatement(make);
		ResultSet result = stmt.executeQuery();
		String output = "";
		while (result.next()){
			String id = "zoneID:"+result.getString("doorID");
			String temp = "temp:"+result.getString("temp");
			String noise = "noise:"+result.getString("noise");
			String light = "light:"+result.getString("light");
			output = output.concat(String.join(",",id,temp,noise,light)+"!");
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
			String drop = "DROP TABLE IF EXISTS Hotel." + tableNames[i];
			PreparedStatement stmt = connection.prepareStatement(drop);
			stmt.executeUpdate();
		}
		return "all tables dropped";
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
			statement.setTimestamp(2, new Timestamp(new java.util.Date().getTime()));
			statement.executeUpdate();
		}
		return "Created?";
	}

	@GetMapping("/getZD")
	private String getZD(@RequestParam(value = "zone")int zone) throws SQLException{
		String make = "SELECT * FROM Hotel.zone"+zone;
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
			retrieveDataSQL= "SELECT * FROM Hotel.movement";
		}else{
			retrieveDataSQL = "SELECT * FROM Hotel.movement WHERE movement.item = '"+item+"'";
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
}
