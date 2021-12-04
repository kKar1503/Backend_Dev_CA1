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

/**
 * The `actLog` function generates a log of the request and response made if the request was sucessful.
 * @param {object} req 
 * @param {object} result
 */
function actLog(req, result) { // Creates a log files for general logging
    timestamp = new Date().toLocaleString("en-US",{timeZone: "Asia/Singapore"});
    logger.log(`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Made: ${req}\nOutput: ${typeof result}\n${JSON.stringify(result)}\n`);
};

/**
 * The `errLog` function generates a error log of the request and response made if the request was unsucessful.
 * @param {object} req 
 * @param {object} err 
 */
function errLog(req, err) {  // Creates a log files for error logging
    timestamp = new Date().toLocaleString("en-US",{timeZone: "Asia/Singapore"});
    logger.error(`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Made: ${req}\nOutput: ${typeof err}\n${JSON.stringify(err)}\n`);
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
// Add User
// http://localhost:3000/users
app.post("/users", function (req, res) {
    let data = {
        "d_username": req.body.username, // must match the postman json body
        "d_email": req.body.email,
        "d_contact": req.body.contact,
        "d_pass": req.body.password,
        "d_type": req.body.type,
        "d_picUrl" : req.body.profile_pic_url
    }

    User.insert(data, function(err, result) {
        if(err) {
            errLog(req, err);
            if(err.code == "ER_DUP_ENTRY") {
                res.status(422).type("json").send('Unprocessable Entity').end();
            } else {
                res.status(500).type("json").send('Internal Server Error').end();
            }
        }

        else {
            actLog(req, result);
            if(result.affectedRows == 1) {
                res.status(201).send(`ID of the newly created user:
                {"userid": ${result.insertId}}`).end();
            }
            else {
                res.status(200).send("Unable to add user!").end();
            }
        }
    });
})

// Get all the users
// http://localhost:3000/users
app.get('/users', function (req, res) {
    User.getUsers( function(err, result) {
        if (!err) {
            actLog(req, result);
            res.status(200).send(result);
        } else {
            errLog(req, err);
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