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
	add: function (uid, int, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				console.log("Connection established!");
				let catArr = int.split(","); // Returns array of all categoryid as an array.
				// // Handles duplicate values from request body
				// let dltQueryStr = "";
				let dltQueryVal = [uid];
				const dltQuery = "DELETE FROM interest WHERE fk_user_id = ?;\n";
				// for (let i = 0; i < catArr.length; i++) {
				//     dltQueryStr += dltQuery;
				//     dltQueryVal.push(uid, parseInt(catArr[i],10));
				// };
				//----------------------------------------------
				// Duplicate queries to match request body
				let queryStr = "";
				let queryVal = [];
				const query = `INSERT INTO interest (fk_user_id, fk_category_id) VALUES (?, ?);\n`;
				for (let i = 0; i < catArr.length; i++) {
					queryStr += query;
					queryVal.push(uid, parseInt(catArr[i], 10));
				}
				//----------------------------------------------
				sql = dltQuery + queryStr;
				queryArray = dltQueryVal.concat(queryVal);
				conn.query(sql, queryArray, (error, result) => {
					conn.end();
					if (error) {
						return callback(error, null);
					} else {
						return callback(null, result);
					}
				});
			}
		});
	},
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Interest;
