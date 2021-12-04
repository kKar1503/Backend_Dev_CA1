//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        review.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Review = {
    insert: function(data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            }else {
                const sql = `
                                INSERT INTO
                                        review (userid, rating, review, productid)
                                VALUES
                                        (?, ?, ?, ) 
                           `;

                dbConn.query(sql, [data.userid, data.rating, data.review, data.productID], (error, result) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null); // querry error             
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
module.exports = Review;