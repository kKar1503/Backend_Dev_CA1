//----------------------------------------
// imports
//----------------------------------------
const express = require('express');
const app = express(); // create an express obj and export it

const bodyParser = require('body-parser'); 
                    // two dots: up one level
const User = require("../model/user");
const Category = require("../model/category");
const Interest = require("../model/interest");
const Product = require("../model/product");
const Review = require("../model/review");

//----------------------------------------
// config
//----------------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//----------------------------------------
// MF Configrations
//----------------------------------------
app.use(urlencodedParser);//attach body-parser middleware
app.use(jsonParser);//parse json data


//----------------------------------------
// endpoints
//----------------------------------------

// For user db


// For category db


// For product db


// For review db


// For interest db





//----------------------------------------
// exports
//----------------------------------------
module.exports = app;