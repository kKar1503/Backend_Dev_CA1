//----------------------------------------
// imports
//----------------------------------------
const express = require('express');
const app = express(); // create an express obj and export it

const bodyParser = require('body-parser'); 
                    // two dots: up one level
const User = require("../model/user");

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



//----------------------------------------
// exports
//----------------------------------------
module.exports = app;