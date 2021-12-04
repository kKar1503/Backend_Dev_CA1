//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        product.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Product = {
    insert: function (post, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
    
          if (err) {//database connection gt issue!
            return callback(err, null);
          } else {
            const sql =
              `
                INSERT INTO product (name, description, categoryid, brand, price)
                VALUES
                (?, ?, ?, ?, ?);
              `;
            dbConn.query(sql, [post.name, post.description, post.categoryid, post.brand, post.price], (error, result) => {
              dbConn.end()
              if (error) {
                return callback(error, null); // query error
              }
              return callback(null, result);
            });
          }
        });
      },
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Product;