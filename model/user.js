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
                return callback(err, null);
            }else {
                const sql = `
                           INSERT INTO
                                user (username, email, contact, password, type, profile_pic_url)
                           VALUES
                                (?, ?, ?, ?, ?, ?) 
                           `;

                dbConn.query(sql, [user.username, user.email, user.contact, user.pass, user.type, user.picUrl], (error, result) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);              
                    };
                    return callback(null, result);
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
                var sql = 'SELCT userid, username, email, contact, type, profile_pic_url, created_at FROM user';
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
                const sql = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user WHERE userid = ?";
                dbConn.query(sql, [userID], (error, result) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);              
                    };
                    return callback(null, result[0]);
                });
            }
        });
    },

    edit: function (userID, user, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = `
                            UPDATE
                                user
                            SET
                                username = ?, 
                                email = ?, 
                                contact = ?, 
                                password = ?,
                                type = ?, 
                                profile_pic_url = ?
                            WHERE
                                userid = ?
                            `;

                dbConn.query(sql, [user.username, user.email, user.contact ,user.pass, user.type, user.picUrl, userID], (error, result) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);              
                    };
                    return callback(null, result);
                });
            }
        });
    },
}

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = User;


