//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        init.js
//----------------------------------------

const fs = require("fs"); // Import File System Module

if (!fs.existsSync("./charts")) {
	fs.mkdirSync("./charts");
	console.log("Created Directory /charts");
}
if (!fs.existsSync("./uploads")) {
	fs.mkdirSync("./uploads");
	console.log("Created Directory /uploads");
}
const token = require("crypto").randomBytes(64).toString("Hex"); // Creates a new token on init

if (!fs.existsSync(".env")) {
	fs.writeFileSync(
		".env",
		`DB_HOST = localhost\nDB_USER = root\nDB_PORT = 3306\nDB_PASS = \nSECRET_KEY = ${token}\nTOKEN_EXPIRY = 15s`
	);
	console.log("Generated file for environmental variables.");
}
