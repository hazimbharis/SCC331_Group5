
/**
 * Start Server with 'node Server.js'
 * Run FrontEnd on differnt port to avoid conflicts
 * To connect to API endpoint listen on port 5000
 */


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
    SELECT m.prisonerID, m.zoneID, m.timeStamp, u.type, u.firstNames, u.lastName, u.medicalConditions
    FROM movement AS m
    JOIN users AS u ON m.prisonerID = u.id
    ORDER BY m.timeStamp DESC;
  `;
  db.query(query, (err, results) => {
    console.log("test");
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
//API endpoint, to get warning data from library
app.get('/api/warnings', (req, res) => {
  const query = `
    SELECT * FROM warnings
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
app.get('/api/deletewarning/:zid/:wid', (req, res) => {
  const zid = req.params.zid
  const wid = req.params.wid


  //const query = `DELETE FROM warnings WHERE zoneID = ? AND warningID = ?`, [zid], [wid]

  db.query('DELETE FROM warnings WHERE zoneID = ? AND warningID = ?', [zid, wid], (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.send("deleted")
      //res.json(results); // Send the results as an object
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
app.get('/api/position', (req, res) => {
  const query = `
  SELECT zoneID, prisonerID, id, firstNames, lastName, medicalConditions, type
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
});

app.get('/api/staffRole', (req, res) => {
  const query = `
  SELECT *
  FROM staff
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results); //Returns all columns of the staff table
    } 
  });
});

app.use(express.json())

app.post('/api/addPrisoner', (req, res) => {
  //Generate a random ID adhering to the protocol, small chance for collison with other IDs, will worse with more prisoners
  let id = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  for (i = 0; i < 2; i++) {
    id += chars.charAt(Math.floor(Math.random() * (chars.length))); 
  }
  for (i = 0; i < 4; i++) {
    id += nums.charAt(Math.floor(Math.random() * (nums.length))); 
  }
  for (i = 0; i < 2; i++) {
    id += chars.charAt(Math.floor(Math.random() * (chars.length))); 
  }
  //Will probably need to check if ID has already been taken
  let medCon = req.body.prisoner.medCon;
  if (medCon == "") {
    medCon = "NULL";
  }
  else {
    medCon = `"` + medCon + `"`;
  }
  let inp = req.body.prisoner //Get the details passed in via the body of the request, assumes all are valid
  const uQuery = `
  INSERT INTO users
  VALUES("` + id + `","` + inp.fName + `","` + inp.lName + `","` + inp.dOB + `","` + inp.gender + `",` + medCon + `,"` + inp.type + `")`;
  const pQuery = `
  INSERT INTO prisoners
  VALUES("` + id + `","` + inp.convs + `","` + inp.startDate + `","` + inp.endDate + `")`;
  db.query(uQuery, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.json({result: "Failed"});
    } else {
      db.query(pQuery, (err, results) => {
        if (err) {
          console.error('Database query error: ' + err.message); //Send response back to client to feedback whether adding the user failed or succeeded
          res.json({result: "Failed"});
        } else {
          res.json({result: "Success", id: id});
        } 
      });
    }
  });
});

app.post('/api/addStaff', (req, res) => {
  //Generate a random ID adhering to the protocol, small chance for collison with other IDs, will worse with more prisoners
  let id = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  for (i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * (chars.length))); 
  }
  for (i = 0; i < 4; i++) {
    id += nums.charAt(Math.floor(Math.random() * (nums.length))); 
  }
  //Will probably need to check if ID has already been taken
  let medCon = req.body.staff.medCon;
  if (medCon == "") {
    medCon = "NULL";
  }
  else {
    medCon = `"` + medCon + `"`;
  }
  let inp = req.body.staff
  const uQuery = `
  INSERT INTO users
  VALUES("` + id + `","` + inp.fName + `","` + inp.lName + `","` + inp.dOB + `","` + inp.gender + `",` + medCon + `,"` + inp.type + `")`;
  const pQuery = `
  INSERT INTO staff
  VALUES("` + id + `","` + inp.role +  `")`;
  db.query(uQuery, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.json({result: "Failed"})
    } else {
      db.query(pQuery, (err, results) => {
        if (err) {
          console.error('Database query error: ' + err.message); //Send response back to client to feedback whether adding the user failed or succeeded
          res.json({result: "Failed"});
        } else {
          res.json({result: "Success", id: id});
        } 
      });
    }
  });
});

app.post('/api/addVisitor', (req, res) => {
  //Generate a random ID adhering to the protocol, small chance for collison with other IDs, will worse with more prisoners
  let id = "";
  const nums = "0123456789";
  for (i = 0; i < 8; i++) {
    id += nums.charAt(Math.floor(Math.random() * (nums.length))); 
  }
  //Will probably need to check if ID has already been taken
  let medCon = req.body.visitor.medCon;
  if (medCon == "") {
    medCon = "NULL";
  }
  else {
    medCon = `"` + medCon + `"`;
  }
  let inp = req.body.visitor
  const uQuery = `
  INSERT INTO users
  VALUES("` + id + `","` + inp.fName + `","` + inp.lName + `","` + inp.dOB + `","` + inp.gender + `",` + medCon + `,"` + inp.type + `")`;
  const pQuery = `
  INSERT INTO visitors
  VALUES("` + id + `","` + inp.pNo +  `")`;
  db.query(uQuery, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.json({result: "Failed"});
    } else {
      db.query(pQuery, (err, results) => {
        if (err) {
          console.error('Database query error: ' + err.message); //Send response back to client to feedback whether adding the user failed or succeeded
          res.json({result: "Failed"});
        } else {
          res.json({result: "Success", id: id});
        } 
      });
    }
  });
});

//Returns all zone history data for the date requested, ordered by zoneID and time ascending
app.get('/api/zoneHistory/:date', (req, res) => {
  const query = `
  SELECT *
  FROM zonehistory
  WHERE date = "` + req.params.date + `"
  ORDER BY zoneID, time`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

//Returns all door history data for the date requested
app.get('/api/doorHistory/:date', (req, res) => {
  const query = `
  SELECT *
  FROM doorhistory
  WHERE date = "` + req.params.date + `"
  ORDER BY doorID, time`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

app.get('/api/prisoners', (req, res) => {
  const query = `
  SELECT *
  FROM users, prisoners
  WHERE users.id = prisoners.id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

app.get('/api/staff', (req, res) => {
  const query = `
  SELECT *
  FROM users, staff
  WHERE users.id = staff.id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

app.get('/api/visitors', (req, res) => {
  const query = `
  SELECT *
  FROM users, visitors
  WHERE users.id = visitors.id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
