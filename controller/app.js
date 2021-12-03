//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        app.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const express = require('express'); 
const app = express(); // Creates an Express Object and export it

const { Console } = require('console'); // Import Console Module for generating log files
const fs = require('fs'); // Import File System Module

const bodyParser = require('body-parser'); 
const User = require("../model/user.js");
const Category = require("../model/category.js");
const Interest = require("../model/interest.js");
const Product = require("../model/product.js");
const Review = require("../model/review.js");

//----------------------------------------
// Creating a Log File System
//----------------------------------------

const logger = new Console({ // Create a new console object to handle stdout (logger.log) and stderr (logger.error)
    stdout: fs.createWriteStream('Activity_Log.txt', {flags: 'a'}),
    stderr: fs.createWriteStream('Error_Log.txt', {flags: 'a'})
});

function actLog(ip, activity) { // Creates a log files for general logging
    timestamp = new Date().toLocaleString("en-US",{timeZone: "Asia/Singapore"});
    logger.log('[Request from: ' + ip + ']\n[Timestamp: ' + timestamp + ']\n' + JSON.stringify(activity) + '\n');
};

function errLog(ip, err) {  // Creates a log files for error logging
    timestamp = new Date().toLocaleString("en-US",{timeZone: "Asia/Singapore"});
    logger.error('[Request from: ' + ip + ']\n[Timestamp: ' + timestamp + ']\n' + JSON.stringify(err) + '\n');
};

//----------------------------------------
// Configurations for bodyParser
//----------------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//----------------------------------------
// MF Configurations
//----------------------------------------
app.use(urlencodedParser); // Attach body-parser middleware
app.use(jsonParser); // Parse JSON data


//----------------------------------------
// Endpoints
//----------------------------------------
//----------------------------------------
// Start of User Endpoints

app.get('/users', function (req, res) {
    User.getUsers( function(err, result) {
        if (!err) {
            actLog(req.ip, result);
            res.status(200).send(result);
        } else {
            errLog(req.ip, err);
            res.status(500).send("505: Internal Server Error!");
        };
    });
});

// End of User Endpoints
//----------------------------------------
//----------------------------------------
// Start of Category Endpoints


// End of Category Endpoints
//----------------------------------------
//----------------------------------------
// Start of Product Endpoints


// End of Product Endpoints
//----------------------------------------
//----------------------------------------
// Start of Review Endpoints


// End of Review Endpoints
//----------------------------------------
//----------------------------------------
// Start of Interest Endpoints


// End of Interest Endpoints
//----------------------------------------



//----------------------------------------
// Module Exports
//----------------------------------------
module.exports = app;