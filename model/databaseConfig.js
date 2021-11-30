//----------------------------------------
// imports
//----------------------------------------
const mysql = require("mysql");
require("dotenv").config();

//----------------------------------------
// main code implementations
//----------------------------------------
var dbconnect = {
    getConnection: function () {
    // here just build connection, but haven't yet start the connection
      var conn = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS, //your own password
        database: 'assignment',
        dateStrings: true
      });
  
      return conn; // returning a connection obj
    }
};

  
//----------------------------------------
// export
//----------------------------------------
module.exports = dbconnect;