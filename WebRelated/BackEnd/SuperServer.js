const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass1234',
  database: 'superusers'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});

//API Endpoint to get organisationKEY
app.get('/api/validateOrganisationKey/:organisationKey', (req, res) => {
  const organisationKey = req.params.organisationKey;
  console.log(organisationKey);
  // Perform database query to check if organisationKey exists
  const query = 'SELECT COUNT(*) AS count FROM Organisation WHERE OrganisationKey = ?';
  db.query(query, [organisationKey], (err, results) => {
      if (err) {
          console.error('Error querying database: ' + err.stack);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      const count = results[0].count;
      console.log(count);
      if (count > 0) {
          res.status(200).json({ message: 'Organisation key is valid' });
      } else {
          res.status(404).json({ error: 'Organisation key does not exist' });
      }
  });
});

  app.get('/api/test', (req, res) => {
    console.log("test");
    const query = `SELECT organisationKey FROM organisation;`;
    db.query(query, (err, results) => {
      console.log("test");
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results);
      }
    });
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });