//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        user.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let User = {
    getUsers: function (callback) { 
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connection established!");
                var sql = 'SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user';
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
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = User;