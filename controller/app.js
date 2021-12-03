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

const bodyParser = require('body-parser'); 
const User = require("../model/user.js");
const Category = require("../model/category.js");
const Interest = require("../model/interest.js");
const Product = require("../model/product.js");
const Review = require("../model/review.js");

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
        if (err) {
            console.log(result);
            res.status(200).send(result);
        } else {
            console.log(err)
            res.status(500);
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