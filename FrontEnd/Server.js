
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
  password: 'aqtwmxsy76J',
  database: 'Microbits'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
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
    SELECT zoneID, prisonerID
    FROM movement
    WHERE zoneID IN (1, 2, 3, 4)
    ORDER BY zoneID
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results[0]); // Send the results as an object
      } 
    });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
