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
const db = require("./databaseConfig.js");
const fs = require("fs");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Image = {
	get: function (productID, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `SELECT name, image_file_name FROM product WHERE productid = ?`;
				dbConn.query(sql, productID, (err, result) => {
					dbConn.end();
					if (err) {
						return callback(err, null);
					} else if (result.length == 0) {
						return callback(new Error(`InvalidProductID`), null);
					} else if (result[0].image_file_name == null) {
						return callback(new Error(`NoImage`), result[0].name);
					} else if (!fs.existsSync(`./uploads/${result[0].image_file_name}`)) {
						return callback(new Error(`ImageNotFound`), result[0].image_file_name);
					} else {
						return callback(null, result[0].image_file_name);
					}
				});
			}
		});
	},
	update: function (filename, productID, overwrite, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `SELECT name, image_file_name FROM product WHERE productid = ?`;
				dbConn.query(sql, productID, (err, result) => {
					if (err) {
						dbConn.end();
						return callback(err, null);
					} else if (result.length == 0) {
						dbConn.end();
						return callback(new Error("InvalidProductID"), null);
					} else if (result[0].image_file_name != null && overwrite != 1) {
						dbConn.end();
						return callback(new Error("ExistingFile"), result[0]);
					} else {
						if (result[0].image_file_name != null && overwrite == 1) {
							if (fs.existsSync(`./uploads/${result[0].image_file_name}`)) {
								fs.unlinkSync(`./uploads/${result[0].image_file_name}`);
							}
						}
						const sql = `UPDATE product SET image_file_name = ? WHERE productid = ?`;
						dbConn.query(sql, [filename, productID], (err, result) => {
							dbConn.end();
							if (err) {
								return callback(err, null);
							}
							console.log(result);
							return callback(null, result);
						});
					}
				});
			}
		});
	},
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Image;
