package com.prison.database;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.sql.*;


//@SpringBootApplication
//@RestController
public class SuperUserDatabaseAppliction {
	// Login variables

	private static final String PASSWORD = "MyNewPass";
	private static String URL = "jdbc:mysql://localhost:3306/?useSSL=FALSE&allowPublicKeyRetrieval=True";
	private static final String USER = "root";
	private static Connection connection;

	// Database variables
	private static final String[] tableNames = { "Organisation", "User", "SmartSystem"};
	/*private static final String[] tableQuery ={
			"email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, systemType CHAR PRIMARY KEY NOT NULL",
			"organisationKey VARCHAR(30) NOT NULL",
	};*/
    private static final String[] tableQuery = {
		"id INT AUTO_INCREMENT PRIMARY KEY, OrganisationName VARCHAR(100) NOT NULL, OrganisationKey VARCHAR(50) UNIQUE NOT NULL",//Organisation attributes
		"id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL, OrganisationId INT, SecretKey VARCHAR(100), FOREIGN KEY (OrganisationId) REFERENCES Organisation(id)",//User attributes
		"id INT AUTO_INCREMENT PRIMARY KEY, systemName VARCHAR(100) NOT NULL, OrganisationId INT, FOREIGN KEY (OrganisationId) REFERENCES Organisation(id)"//Smart system attributes
};
	// Microbit variables
	private static SerialMonitor monitor;


	static {
		try {
			connection = DriverManager.getConnection(URL,USER,PASSWORD);
			Statement stmt = connection.createStatement();
			stmt.execute("CREATE DATABASE IF NOT EXISTS superusers");
			URL = "jdbc:mysql://localhost:3306/superusers?useSSL=FALSE&allowPublicKeyRetrieval=True";
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

	private static void initialize() throws SQLException {
		String reset = "DROP TABLE IF EXISTS superusers.Realtime ";
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


}


