const express = require('express')
const mysql = require('mysql')

//Create connection
const db = mysql.createConnection({
    host: 'localhost:8080',
    user: 'root',
    password: 'MyNewPass'
})

//Connect to MySQL
db.connect(err => {
    if(err) {
        throw err
    }
    console.log('MySQL Connected')
})

const app = express()

//