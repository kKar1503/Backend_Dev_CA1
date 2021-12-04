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
    insert: function(user, callback) {
        var dbConn = db.getConnection();

        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 

            else {
                const sql = `
                           INSERT INTO
                                user (username, email, contact, password, type, profile_pic_url)
                           VALUES
                                (?, ?, ?, ?, ?, ?) 
                           `;

                dbConn.query(sql, [user.d_username, user.d_email, user.d_contact, user.d_pass, user.d_type, user.d_picUrl], (error, q_result) => {
                    dbConn.end();

                    if (error) {
                        console.log("query error");
                        return callback(error, null);              
                    };
                    
                    return callback(null, q_result);
                    
                    /*
                        q_result: {
                            affectedRows: 1,
                            ...,
                            insertId: 5,
                            ...,
                        }
                    */
                    
                });
            }
        });
   },

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

    findByID: function(userID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user WHERE userid = ?";;
                dbConn.query(sql, [userID], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);              
                    };
                    // no record
                    if(results.length == 0) {
                        return callback(null, null);
                    }else {
                        return callback(null, results[0]); // only return the result not whole array
                    }
                });
            }
        });
    },
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = User;