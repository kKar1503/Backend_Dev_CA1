//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        category.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Category = {
    getCats: function (callback) { 
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log("Connection established!");
                var sql = 'SELECT categoryid, category, description FROM category';
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                });
            };
        });
    },
    addCat: function(cat, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connection established!");
                const sql = `
                           INSERT INTO
                                user (category, description)
                           VALUES
                                (?, ?) 
                           `;
                conn.query(sql, [cat.category, cat.description], (error, result) => {
                    conn.end();
                    if (error) {
                        return callback(error, null);              
                    } else {
                        return callback(null, result);
                    }
                });
            };
        });
    }
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Category;