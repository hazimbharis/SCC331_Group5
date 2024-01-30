const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'your-database-host',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Define API endpoint to fetch population data for four areas
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
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
