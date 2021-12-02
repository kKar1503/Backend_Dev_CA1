//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:      Li Kehan & Yam Kar Lok
// Admission No:  P2111575 & P2123181
// Class:         DIT/FT/1B/04
// Filename:      databaseConfig.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const mysql = require("mysql");
require("dotenv").config();

//----------------------------------------
// Main Code Implementations
//----------------------------------------
var dbconnect = {
    getConnection: function () {
    // Here just build connection, but haven't yet start the connection
      var conn = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS, // Password of the MySQL Database
        database: 'it_products',
        dateStrings: true,
        multipleStatements: true
      });
  
      return conn; // Returning a Connection Object
    }
};

  
//----------------------------------------
// Module Export
//----------------------------------------
module.exports = dbconnect;