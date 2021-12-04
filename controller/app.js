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
 * @param {object} req Request object from the Express framework
 * @param {object} result Result from the MySQL query
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Activity_Log.txt
 */
function actLog(req, result, note = "") { // Creates a log files for general logging
    timestamp = new Date().toLocaleString('en-US',{timeZone: 'Asia/Singapore'});
    logger.log(`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Type: ${req.method}\nRequest Made: ${JSON.stringify(req.body)}\nOutput: ${note}\n${JSON.stringify(result)}\n`);
};

/**
 * The `errLog` function generates a error log of the request and response made if the request was unsucessful.
 * @param {object} req Request object from the Express framework
 * @param {object} err Error generated from connection to server
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Error_Log.txt
 */
function errLog(req, err, note = "") {  // Creates a log files for error logging
    timestamp = new Date().toLocaleString('en-US',{timeZone: 'Asia/Singapore'});
    // Error handling for error logging
    if (JSON.stringify(req.body) == '{}' && req.method != 'GET') {
        err = "Empty request body was passed into non-GET HTTP request."
    } else if (err.errno == 1048) {
        err = "Null value was passed into a Not Null column."
    } else if (err.errno == 1062) {
        err = "Duplicated entry."
    };
    logger.error(`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Type: ${req.method}\nRequest Made: ${JSON.stringify(req.body)}\nOutput: ${note}\n${JSON.stringify(err)}\n`);};

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

// POST New User
// http://localhost:3000/users
app.post("/users", function (req, res) {
    let data = {
        "username": req.body.username, // must match the postman json body
        "email": req.body.email,
        "contact": req.body.contact,
        "pass": req.body.password,
        "type": req.body.type,
        "picUrl" : req.body.profile_pic_url
    }

    User.insert(data, function(err, result) {
        if(err) {
            errLog(req, err);
            if(err.errno == 1062) {
                res.status(422).send(); // The new username OR new email provided already exists.
            } else {
                res.status(500).send(); // Unknown error
            }
        } else {
            actLog(req, result);
                res.status(201).send(`ID of the newly created user:
                {"userid": ${result.insertId}}`);
        }
    });
})

// GET all the users
// http://localhost:3000/users
app.get('/users', function (req, res) {
    User.getUsers(function(err, result) {
        if (!err) {
            actLog(req, result);
            res.status(200).send(result);
        } else {
            errLog(req, err);
            res.status(500).end();
        };
    });
});

// Find User by ID
// http://localhost:3000/users/3
app.get("/users/:userID", function (req, res) {
    let uid = parseInt(req.params.userID);
    
    User.findByID(uid, function(err, result) {
        if(err) {
            errLog(req, err);
            res.status(500).end(); // Unknown error
        }else {
            actLog(req, result);
            res.status(200).type('json').send(result);
        }
    });
})

// Update User
// http://localhost:3000/users/6
app.put("/users/:userID", function (req, res) {
    let uid = parseInt(req.params.userID);
    let data = {
        "username": req.body.username, // must match the postman json body
        "email": req.body.email,
        "contact": req.body.contact,
        "pass": req.body.password,
        "type": req.body.type,
        "picUrl" : req.body.profile_pic_url
    }

    User.edit(uid, data, function(err, result) {
        if(err) {
            errLog(req, err);
            if(err.errno == 1062) {
                res.status(422).send(); // The new username OR new email provided already exists.
            } else {
                res.status(500).send(); // Unknown error
            }
        }else {
            actLog(req, result, "User is updated!");
            res.status(204).send("N/A");
        }
    });
})
// End of User Endpoints
//----------------------------------------
//----------------------------------------
// Start of Category Endpoints

// GET all the category
// http://localhost:3000/category
app.get('/category', function (req, res) {
    Category.getCats(function(err, result) {
        if (!err) {
            actLog(req, result, "GET Category");
            res.status(200).send(result);
        } else {
            errLog(req, err, "GET Category");
            res.status(500).end(); // Unknown error
        };
    });
});

// POST New Category
// http://localhost:3000/category
app.post('/category', function (req, res) {
    let cat = {
        category: req.body.category, 
        description: req.body.description
    }
    Category.addCat(cat, function(err, result) {
        if (!err) {
            actLog(req, result, "POST Category");
            res.status(204).end();
        } else {
            errLog(req, err, "POST Category");
            if (err.errno == 1062) {
                res.status(422).end(); // The category name provided already exists.
            } else {
                res.status(500).end(); // Unknown error
            };
        };
    });
});

// End of Category Endpoints
//----------------------------------------
//----------------------------------------
// Start of Product Endpoints

// Add new product to db
// http://localhost:3000/product
app.post("/product", function (req, res) {
    Product.insert(req.body, function (error, result) {
      if (error) {
        errLog(req, error, "Cannot add new product");
        res.status(500).send(); // Unknown error
        return;
      }
      actLog(req, result, "New product added");
      res.status(201).send(`ID of the newly created listing: \n{\n"productid": ${result.insertId}\n}`);
    });
});

// Find the product by product ID
// http://localhost:3000/product/3
app.get("/product/:productID", function (req, res) {
    const productID = parseInt(req.params.productID);
    Product.findByID(productID, function (error, result) {
      if (error) {
        errLog(req, error, "Cannot find product by id!");
        res.status(500).send();
        return;
      }
      actLog(req, result, "Product is found!");
      res.status(200).send(`Info of the matching product (including category name):\n ${JSON.stringify(result)}`);
    });
});


// Delete the product by product ID
// http://localhost:3000/product/1 
app.delete("/product/:productID", function (req, res) {
    const productID = parseInt(req.params.productID);

    Product.delete(productID, (error, result) => {
        if (error) {
            errLog(req, error, "Cannot delete product");
            res.status(500).send(); // Unknown error
            return;
        }
        actLog(req, result, "Product deleted!");
        res.status(204).send(`N/A`);
    });
});
// End of Product Endpoints
//----------------------------------------
//----------------------------------------
// Start of Review Endpoints

// Add New review
// http://localhost:3000/product/:id/review
app.post("/product/:productID/review", function (req, res) {
    const productID = parseInt(req.params.productID);

    let data = {
        "userid": req.body.userid, // must match the postman json body
        "rating": req.body.rating,
        "review": req.body.review,
        "productID" : productID
    }

    Review.insert(data, function(err, result) {
        if(err) {
            errLog(req, err, "Review cannot add!");
            res.status(500).send(); // Unknown error
        } else {
            actLog(req, result, "Review added successfully!");
                res.status(201).send(`ID of the newly created listing:
                {"reviewid": ${result.insertId}}`);
        }
    });
})

// End of Review Endpoints
//----------------------------------------
//----------------------------------------
// Start of Interest Endpoints

// POST New Interest
// http://localhost:3000/interest/:userid
app.post('/interest/:userID', function (req, res) {
    let uid = parseInt(req.params.userID);
    let int = req.body.categoryids;
    Interest.add(uid, int, function(err, result) {
        if (!err) {
            actLog(req, result, "POST Interest");
            res.status(201).end(); // Created
        } else {
            errLog(req, err, "POST Interest");
            res.status(500).end(); // Unknown error
        };
    });
});

// End of Interest Endpoints
//----------------------------------------



//----------------------------------------
// Module Exports
//----------------------------------------
module.exports = app;