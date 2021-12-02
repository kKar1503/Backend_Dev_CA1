//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        server.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const app = require("./controller/app.js");

//----------------------------------------
// Configurations for Server
//----------------------------------------
var port = 3000;
var hostname="localhost";

//----------------------------------------
// Main Logic
//----------------------------------------

app.listen(port, hostname, () => {
    console.log(`Server started and accessible via http://${hostname}:${port}/`);
});