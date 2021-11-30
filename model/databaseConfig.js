//----------------------------------------
// imports
//----------------------------------------
const mysql = require("mysql");

//----------------------------------------
// main code implementations
//----------------------------------------
var dbconnect = {
    getConnection: function () {
    // here just build connection, but haven't yet start the connection
      var conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'lkH2004217200413!', //your own password
        database: 'friendbook',
        dateStrings: true
      });
  
      return conn; // returning a connection obj
    }
};

  
//----------------------------------------
// export
//----------------------------------------
module.exports = dbconnect;