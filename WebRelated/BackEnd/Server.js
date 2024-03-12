
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

app.get('/api/ChangeDatabase/:database', (req, res) => {
  const database = req.params.database;
  db.database = database;
  res.json("Changed URL!");
});

app.get('/api/UserHistory/:pid', (req, res) => {
  const pid = req.params.pid;
  const query = `
    SELECT zoneID,
           SUM(UNIX_TIMESTAMP(end_time) - UNIX_TIMESTAMP(start_time)) AS time_spent
    FROM (
      SELECT prisonerID, zoneID,
             LEAD(timeStamp) OVER (ORDER BY timeStamp) AS end_time,
             timeStamp AS start_time
      FROM movement
      WHERE prisonerID = ?
    ) AS subquery
    GROUP BY zoneID;
  `;
  db.query(query, [pid], (err, results) => { // Using parameterized query
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

//API endpoint to reterive timestamps from new UI user positions
app.get('/api/NewUIPositions', (req, res) => {//'2024-02-05 15:30:45.123' - format of timestamp to be added
  const query = `
  WITH LatestMovements AS (
    SELECT 
        m.prisonerID,
        m.zoneID,
        m.timeStamp,
        ROW_NUMBER() OVER(PARTITION BY m.prisonerID ORDER BY m.timeStamp DESC) AS rn
    FROM 
        movement m
  )
  SELECT 
    u.type,
      lm.zoneID,
      lm.prisonerID,
      u.firstNames,
      u.lastName
  FROM 
      LatestMovements lm
  INNER JOIN 
      users u ON lm.prisonerID = u.id
  WHERE 
      lm.rn = 1;
  `;
  db.query(query, (err, results) => {
    console.log("test");
    if(err) {
      console.error('Database query error Movememt UI: ' + err.message);
      res.status(500).json({error: 'Database error' });
    }else{
      //console.log(results);
      res.json(results);
    }
  });
});
/**
 * CREATE TABLE your_table_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    your_timestamp_column TIMESTAMP(3) -- Define the column with precision for milliseconds
);

 */
app.get('/api/UserHistoryData/:uid', (req, res) => {
  const uid = req.params.uid; // 
  const query = `
    SELECT * FROM users
    WHERE id = ?;
  `;
  db.query(query, [uid], (err, results) => {
    console.log("test");
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

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

//Get user count in timeframe, as well as mean, max and min
app.get('/api/countUsers/:sDate/:eDate', (req, res) => {
  var data = {}
  const usersNum = new Promise((resolve, reject) => {
    const query = `
    SELECT COUNT(DISTINCT prisonerID) as "noOfUsers"
    FROM movement
    WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999"`; //Distinct needed to not count same user more than once
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        data.noOfUsers = results[0].noOfUsers
        resolve(0);
      } 
    });
  })
  const mean = new Promise((resolve, reject) => {
    const query = `
    SELECT AVG(noOfUsers) as "mean"
    FROM 
      (SELECT DATE(timeStamp), COUNT(DISTINCT prisonerID) as "noOfUsers"
      FROM movement
      WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999"
      GROUP BY DATE(timestamp)) as movements`; //Assumes there is data for every single day, group by day to count number of users for each individual day
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        data.mean = results[0].mean
        resolve(0);
      } 
    });
  })
  const minMax = new Promise((resolve, reject) => {
    const query = `
    SELECT MAX(noOfUsers) as "max", MIN(noOfUsers) as "min"
    FROM
      (SELECT DATE(timeStamp) as "date" , COUNT(DISTINCT prisonerID) as "noOfUsers"
      FROM movement
      WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999"
      GROUP BY DATE(timestamp)) as movements`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        res.status(500).json({ error: 'Database error' });
      } else {
        if (results[0].max != undefined && results[0].min != undefined) { //If no data, server will crash due to MySQL error with undefined
          const maxDate = new Promise((resolve, reject) => { //Get max date by fetching the record where the noOfUsers is the same as the maximum
            const query = `
            SELECT Date as "date"
            FROM
              (SELECT DATE(timeStamp) as "Date", COUNT(DISTINCT prisonerID) as "noOfUsers"
              FROM movement 
              WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999" 
              GROUP BY DATE(timestamp)) as movements WHERE noOfUsers = ` + results[0].max;
            db.query(query, (err, results) => {
              if (err) {
                console.error('Database query error: ' + err.message);
                res.status(500).json({ error: 'Database error' });
              } else {
                data.maxDate = results[0].date
                resolve(0);
              } 
            });
          })
          const minDate = new Promise((resolve, reject) => {
            const query = `
            SELECT Date as "date"
            FROM
              (SELECT DATE(timeStamp) as "Date", COUNT(DISTINCT prisonerID) as "noOfUsers"
              FROM movement 
              WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999" 
              GROUP BY DATE(timestamp)) as movements WHERE noOfUsers = ` + results[0].min;
            db.query(query, (err, results) => {
              if (err) {
                console.error('Database query error: ' + err.message);
                res.status(500).json({ error: 'Database error' });
              } else {
                data.minDate = results[0].date
                resolve(0);
              } 
            });
          })
          data.max = results[0].max;
          data.min = results[0].min;
          Promise.all([maxDate, minDate]).then((ress) => {
            resolve(0);
          })
        }
        else {
          data.max = 0; //In case period selected with no data
          data.min = 0;
          data.minDate = "0000-00-00";
          data.maxDate = "0000-00-00";
          resolve(0);
        }
      } 
    });
  })
  Promise.all([usersNum, mean, minMax]).then((ress) => { //Only send data once all data is ready via promises
    res.json(data);
  })
})

//Get user types data in timeframe
app.get('/api/userTypes/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT type, COUNT(type) as "count"
  FROM
    (SELECT DISTINCT id, type FROM users, movement
    WHERE users.id = movement.prisonerID AND timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999") as us
  GROUP BY type`; //Count number of user types by grouping them together
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

//Get number of users on each day in timeframe
app.get('/api/dayCount/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT DATE(timeStamp) as "Date", COUNT(DISTINCT prisonerID) as "noOfUsers"
  FROM movement
  WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999"
  GROUP BY Date`; //Count number of users per day by counting instances of each date and grouping them
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

//Get number of movements for each zone in timeframe
app.get('/api/movementCount/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT zoneID, COUNT(prisonerID) as "count"
  FROM movement
  WHERE timeStamp >= "` + req.params.sDate + ` 00:00:00.000" AND timeStamp <= "` + req.params.eDate + ` 23:59:59.999"
  GROUP BY zoneID`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

//Get mean of environment data in timeframe
app.get('/api/envMeans/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT AVG(temp) as mTemp, AVG(noise) as mNoise, AVG(light) as mLight
  FROM zonehistory
  WHERE date >= "` + req.params.sDate + `" AND date <= "` + req.params.eDate + `"`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results[0]);
    } 
  });
})

//Get number of zones
app.get('/api/zoneCount/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT MAX(DISTINCT zoneID) as "noOfZones" 
  FROM zonehistory
  WHERE date >= "` + req.params.sDate + `" AND date <= "` + req.params.eDate + `"`; //Use max as system assumes all IDs are sequential (non skipped)
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results[0]);
    } 
  });
})

//Get mean environment data for each day
app.get('/api/zoneDayData/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT zoneID, date, AVG(temp) as temp, AVG(noise) as noise, AVG(light) as light
  FROM zonehistory
  WHERE date >= "` + req.params.sDate + `" AND date <= "` + req.params.eDate + `" 
  GROUP BY zoneID, date
  ORDER BY date`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } 
  });
})

//Get number of doors
app.get('/api/doorCount/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT MAX(DISTINCT doorID) as "noOfDoors"
  FROM doorhistory
  WHERE date >= "` + req.params.sDate + `" AND date <= "` + req.params.eDate + `"`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results[0]);
    } 
  });
})

//Get door history in timeframe
app.get('/api/dHistory/:sDate/:eDate', (req, res) => {
  const query = `
  SELECT *
  FROM doorhistory
  WHERE date >= "` + req.params.sDate + `" AND date <= "` + req.params.eDate + `"`;
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
