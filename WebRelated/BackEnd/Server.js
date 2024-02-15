
/**
 * Start Server with 'node Server.js'
 * Run FrontEnd on differnt port to avoid conflicts
 * To connect to API endpoint listen on port 5000
 */


const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MyNewPass',
  database: 'microbits'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});
/**
 * CREATE TABLE your_table_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    your_timestamp_column TIMESTAMP(3) -- Define the column with precision for milliseconds
);

 */

//API endpoint to reterive timestamps from movement table
app.get('/api/MovementTime', (req, res) => {//'2024-02-05 15:30:45.123' - format of timestamp to be added
  const query = `
  SELECT prisonerID, zoneID, timestamp
  FROM movement
  WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 3 HOUR)
  ORDER BY timestamp ASC`;
  db.query(query, (err, results) => {
    if(err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({error: 'Database error' });
    }else{
      //console.log(results);
      res.json(results);
    }
  });
});
//API endpoint to retreive door states from databse
app.get('/api/door', (req, res) => {
  const query = `
  SELECT doorID, locked, closed, alarm
  FROM lockstatus
  WHERE doorID IN (1, 2, 3, 4)
  ORDER BY doorID
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      //console.log(results);
      res.json(results); // Send the results as an object
    } 
  });
});
//start of bad code
//API endpoint, to get env data from gym
app.get('/api/gym', (req, res) => {
  const query = `
    SELECT * FROM environment WHERE zoneID = 1
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); // Send the results as an object
    } 
  });
});
//API endpoint, to get env data from canteen
app.get('/api/canteen', (req, res) => {
  const query = `
    SELECT * FROM environment WHERE zoneID = 2
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); // Send the results as an object
    } 
  });
});
//API endpoint, to get env data from livingroom
app.get('/api/livingroom', (req, res) => {
  const query = `
    SELECT * FROM environment WHERE zoneID = 3
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); // Send the results as an object
    } 
  });
});
//API endpoint, to get env data from library
app.get('/api/library', (req, res) => {
  const query = `
    SELECT * FROM environment WHERE zoneID = 4
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); // Send the results as an object
    } 
  });
});
// end of bad code

//API endpoint, to get tables of all prisoners in each zone
app.get('/api/movement', (req, res) => {
  const query = `
    SELECT * FROM movement
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); // Send the results as an object
    } 
  });
});
//API endpoint to fetch population data for four areas
app.get('/api/population', (req, res) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM movement WHERE zoneID = 1) AS Gym,
        (SELECT COUNT(*) FROM movement WHERE zoneID = 2) AS Canteen,
        (SELECT COUNT(*) FROM movement WHERE zoneID = 3) AS Library,
        (SELECT COUNT(*) FROM movement WHERE zoneID = 4) AS LivingRoom
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results[0]); // Send the results as an object
      } 
    });
  });
//API EndPoint for Prisoner Positioning system
app.get('/api/position', (req, res) =>{
    const query = `
    SELECT zoneID, prisonerID, id, firstNames, lastName, type
    FROM movement, users
    WHERE zoneID IN (1, 2, 3, 4) AND id = prisonerID
    ORDER BY zoneID
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results); // Send the results as an object
      } 
    });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
