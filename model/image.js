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
const e = require("express");
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
	get: function (productID, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `SELECT image_file_name FROM product WHERE productid = ?`;
				dbConn.query(sql, productID, (err, result) => {
					dbConn.end();
					if (err) {
						return callback(err, null);
					}
					console.log(result[0].image_file_name);
					return callback(null, result[0].image_file_name);
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
				const sql = `
                            SELECT
                                name, image_file_name
                            FROM
                                product
                            WHERE
                                productid = ?
                            `;
				dbConn.query(sql, productID, (err, result) => {
					dbConn.end();
					if (err) {
						return callback(err, null);
					} else if (
						result[0].image_file_name != null &&
						overwrite == 0
					) {
						return callback("Existing File", result[0]);
					} else {
						dbConn.connect(function (err) {
							if (err) {
								return callback(err, null);
							} else {
								const sql = `
                                            UPDATE
                                                product
                                            SET
                                                image_file_name = ?
                                            WHERE
                                                productid = ?
                                            `;
								dbConn.query(
									sql,
									[filename, productID],
									(err, result) => {
										dbConn.end();
										if (err) {
											return callback(err, null);
										}
										console.log(result);
										return callback(null, result);
									}
								);
							}
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
