//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        image.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const { query } = require("express");
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Image = {
	upload: function (fileName, productID, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				console.log("connected");
				const sql = `
                            UPDATE
                                product
                            SET
                                image_file_name  = ?
                            WHERE
                                productid = ?
                            `;

				dbConn.query(sql, [fileName, productID], (err, result) => {
					dbConn.end();
					if (err) {
						return callback(err, null);
					}
					return callback(null, result);
				});
			}
		});
	},
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Image;
