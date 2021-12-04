//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        interest.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Interest = {
    add: function(uid, int, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("Connection established!");
                let catArr = int.split(','); // Returns array of all categoryid as an array.
                const dltQuery = `DELETE FROM interest WHERE`;
                conn.query(sql, [cat.category, cat.description], (error, result) => {
                    conn.end();
                    if (error) {
                        return callback(error, null);              
                    } else {
                        return callback(null, result);
                    };
                });
            };
        });
    }
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Interest;