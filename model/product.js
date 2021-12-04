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

    findByID: function (productID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
    
          if (err) {
            return callback(err, null); // db connection err
          } else {
            const sql =
              `
                SELECT 
                    name,
                    p.description,
                    p.categoryid,
                    category AS categoryname,
                    brand,
                    price
                FROM 
                    product AS p, category AS c
                WHERE productid = ? AND p.categoryid = c.categoryid
              `;
            dbConn.query(sql, productID, (error, result) => {
              dbConn.end();
              if (error) {
                return callback(error, null);
              }
              return callback(null, result[0]);
            });
          }
        });
    },

    delete: function (productID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
    
          if (err) {//database connection gt issue!
            console.log(err);
            return callback(err, null);
          }else {
            const sql =
              `
                DELETE FROM product
                WHERE productid = ?
              `;
            dbConn.query(sql, productID, (error, result) => {
              dbConn.end();
              if (error) {
                return callback(error,null);
              };
              return callback(null,result);
            });
          }
        });
    }
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Product;