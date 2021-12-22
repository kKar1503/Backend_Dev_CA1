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
	insert: function (data, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `
                                INSERT INTO
                                        review (userid, rating, review, productid)
                                VALUES
                                        (?, ?, ?, ?) 
                           `;

				dbConn.query(
					sql,
					[data.userid, data.rating, data.review, data.productID],
					(error, result) => {
						dbConn.end();
						if (error) {
							return callback(error, null); // querry error
						}
						return callback(null, result);
					}
				);
			}
		});
	},

	getReviews: function (productID, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				conn.end();
				return callback(err, null);
			} else {
				var productSQL = "SELECT productid FROM product WHERE productid = ?"; // sql to change to a join table query with category table to get category name
				conn.query(productSQL, [productID], function (error, result) {
					if (error) {
						conn.end();
						return callback(error, null);
					} else { 
						if(result.length == 0) return callback(null, null); // no such product
						const sql = `
									SELECT 
										productid, r.userid, username, rating, review, r.created_at 
									FROM 
										review AS r, user AS u
									WHERE 
										productid = ? AND r.userid = u.userid
									`;
						conn.query(sql, [productID], function (err, result) {
							conn.end();
							if (err) {
								return callback(err, null);
							} else {
								return callback(null, result);
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
module.exports = Review;
