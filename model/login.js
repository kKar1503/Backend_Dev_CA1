//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        login.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Login = {
	authenticate: function (loginData, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `SELECT password, type FROM user WHERE username = ?`;
				dbConn.query(sql, loginData.user, (err, result) => {
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
module.exports = Login;
