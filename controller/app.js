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
const express = require("express");
const app = express(); // Creates an Express Object and export it

const { Console } = require("console"); // Import Console Module for generating log files
const fs = require("fs"); // Import File System Module

const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("../model/user.js");
const Category = require("../model/category.js");
const Interest = require("../model/interest.js");
const Product = require("../model/product.js");
const Review = require("../model/review.js");
const Chart = require("../model/chart.js");
//----------------------------------------
// Creating a Log File System
//----------------------------------------

const logger = new Console({
	// Create a new console object to handle stdout (logger.log) and stderr (logger.error)
	stdout: fs.createWriteStream("Activity_Log.txt", { flags: "a" }),
	stderr: fs.createWriteStream("Error_Log.txt", { flags: "a" }),
});

/**
 * The `actLog` function generates a log of the request and response made if the request was sucessful.
 * @param {object} req Request object from the Express framework
 * @param {object} result Result from the MySQL query
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Activity_Log.txt
 */
function actLog(req, result, note = "") {
	// Creates a log files for general logging
	timestamp = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Singapore",
	});
	logger.log(
		`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Type: ${
			req.method
		}\nRequest Made: ${JSON.stringify(
			req.body
		)}\nOutput: ${note}\n${JSON.stringify(result)}\n`
	);
}

/**
 * The `errLog` function generates a error log of the request and response made if the request was unsucessful.
 * @param {object} req Request object from the Express framework
 * @param {object} err Error generated from connection to server
 * @param {string} note Note(s) to be added in the log
 * @returns log statements in the Error_Log.txt
 */
function errLog(req, err, note = "") {
	// Creates a log files for error logging
	timestamp = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Singapore",
	});
	// Error handling for error logging
	if (JSON.stringify(req.body) == "{}" && req.method != "GET") {
		err = "Empty request body was passed into non-GET HTTP request.";
	} else if (err == null) {
		err = "Non SQL Error.";
	} else if (err.errno == 1048) {
		err = "Null value was passed into a Not Null column.";
	} else if (err.errno == 1062) {
		err = "Duplicated entry.";
	}
	logger.error(
		`[Request from: ${req.ip}]\n[Timestamp: ${timestamp}]\nRequest Type: ${
			req.method
		}\nRequest Made: ${JSON.stringify(
			req.body
		)}\nOutput: ${note}\n${JSON.stringify(err)}\n`
	);
}

//----------------------------------------
// Configuration for Multer (Image Uploading Endpoint)
//----------------------------------------
const storage = multer.diskStorage({
	destination: function (req, files, callback) {
		callback(null, "./uploads/");
	},
	filename: function (req, file, callback) {
		callback(
			null,
			new Date().toISOString().replace(/:/g, "-") + file.originalname
		);
	},
});
const fileFilter = (req, file, callback) => {
	// Reject a File
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg"
	) {
		// Limit to JPG/JPEG/PNG
		callback(null, true);
	} else {
		callback(
			new Error("Filetype Mismatched: Only accepts JPEG/JPG/PNG"),
			false
		);
	}
};
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024, // Limit to 1MB
	},
	fileFilter: fileFilter,
}).single("productImage");

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

// POST New User [Done]
// http://localhost:3000/users
app.post("/users", function (req, res) {
	let data = {
		username: req.body.username, // must match the postman json body
		email: req.body.email,
		contact: req.body.contact,
		pass: req.body.password,
		type: req.body.type,
		picUrl: req.body.profile_pic_url,
	};

	User.insert(data, function (err, result) {
		if (err) {
			errLog(req, err);
			if (err.errno == 1062) {
				res.status(422).send(); // The new username OR new email provided already exists.
			} else {
				res.status(500).send(); // internal error
			}
		} else {
			actLog(req, result);
			res.status(201).send(`ID of the newly created user:
            {"userid": ${result.insertId}}`);
		}
	});
});

// GET all the users [Done]
// http://localhost:3000/users
app.get("/users", function (req, res) {
	User.getUsers(function (err, result) {
		if (!err) {
			if (result.length == 0) {
				actLog(req, result, "User database is empty");
				res.status(404).send("No users found!"); // User database doesn't have any data
			} else {
				actLog(req, result, "Users found!");
				res.status(200).send(result);
			}
		} else {
			errLog(req, err);
			res.status(500).end();
		}
	});
});

// Find User by ID [Done]
// http://localhost:3000/users/3
app.get("/users/:id", function (req, res) {
	let uid = parseInt(req.params.id);
	if (isNaN(uid)) {
		console.log("Input user id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	User.findByID(uid, function (err, result) {
		if (err) {
			errLog(req, err);
			res.status(500).end(); // internal error
		} else {
			if (result == null) {
				actLog(req, result, "find user by id");
				console.log("Userid doesn't exist");
				res.status(404).send("Userid doesn't exist"); // Userid doesn't exist
			} else {
				actLog(req, result, "find user by id");
				res.status(200).type("json").send(result);
			}
		}
	});
});

// Update User [Done]
// http://localhost:3000/users/6
app.put("/users/:id", function (req, res) {
	let uid = parseInt(req.params.id);

	if (isNaN(uid)) {
		errLog(req, err, "Input user id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	let data = {
		username: req.body.username, // must match the postman json body
		email: req.body.email,
		contact: req.body.contact,
		pass: req.body.password,
		type: req.body.type,
		picUrl: req.body.profile_pic_url,
	};
	User.edit(uid, data, function (err, result) {
		if (err) {
			errLog(req, err, "Update user error");
			if (err.errno == 1062) {
				res.status(422).send(); // The new username OR new email provided already exists.
			} else {
				res.status(500).send(); // internal error
			}
		} else {
			if (result.affectedRows == 0) {
				actLog(req, result, "User cannot be updated as not found!");
				res.status(404).send("User cannot be updated as not found!");
			} else if (result.changedRows == 1) {
				actLog(req, result, "User is updated!");
				res.status(204).send();
			} else {
				actLog(
					req,
					result,
					"Existing row is set to its current values"
				);
				res.status(200).send(
					"Existing row is set to its current values"
				); // No changes as the changed info is same as previous one(existing row is set to its current values)
			}
		}
	});
});
// End of User Endpoints
//----------------------------------------

//----------------------------------------
// Start of Category Endpoints

// GET all the category [Done]
// http://localhost:3000/category
app.get("/category", function (req, res) {
	Category.getCats(function (err, result) {
		if (!err) {
			// no internal error
			if (result.length == 0) {
				actLog(req, result, "Category database is empty");
				res.status(404).send("Category database is empty");
			} else {
				actLog(req, result, "GET Category");
				res.status(200).send(result);
			}
		} else {
			errLog(req, err, "GET Category error");
			res.status(500).end(); // internal error
		}
	});
});

// POST New Category [Done]
// http://localhost:3000/category
app.post("/category", function (req, res) {
	let cat = {
		category: req.body.category,
		description: req.body.description,
	};
	Category.addCat(cat, function (err, result) {
		if (!err) {
			actLog(req, result, "POST Category success");
			res.status(204).send();
		} else {
			errLog(req, err, "POST Category failed");
			if (err.errno == 1062) {
				res.status(422).end(); // The category name provided already exists.
			} else {
				res.status(500).end(); // Unknown error
			}
		}
	});
});

// End of Category Endpoints
//----------------------------------------

//----------------------------------------
// Start of Product Endpoints

// Add new product to db [Pending]
// http://localhost:3000/product
app.post("/product", function (req, res) {
	Product.insert(req.body, function (error, result) {
		if (error) {
			errLog(req, err, "Cannot add new product");
			if (err.errno == 1062) {
				res.status(422).send(); // The new username OR new email provided already exists.
			} else {
				res.status(500).send(); // Unknown error
			}
		} else {
			actLog(req, result, "New product added");
			res.status(201).send(
				`ID of the newly created listing: \n{\n"productid": ${result.insertId}\n}`
			);
		}
	});
});

// Find the product by product ID [Done]
// http://localhost:3000/product/3
app.get("/product/:id", function (req, res) {
	const productID = parseInt(req.params.id);
	if (isNaN(productID)) {
		console.log("Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	Product.findByID(productID, function (error, result) {
		if (error) {
			errLog(req, error, "Cannot find product by id!");
			res.status(500).send();
		} else {
			if (result == null) {
				console.log("Productid doesn't exist");
				res.status(404).send("Productid doesn't exist"); // Productid doesn't exist
			} else {
				actLog(req, result, "Product is found!");
				res.status(200).send(
					`Info of the matching product (including category name):\n ${JSON.stringify(
						result
					)}`
				);
			}
		}
	});
});

// Delete the product by product ID [Done]
// http://localhost:3000/product/1
app.delete("/product/:id", function (req, res) {
	const productID = parseInt(req.params.id);
	if (isNaN(productID)) {
		console.log("Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	Product.delete(productID, (error, result) => {
		if (error) {
			if (err.errno == 1451) {
				errLog(req, error, "Cannot delete or update a parent row"); //ER_ROW_IS_REFERENCED_2
				res.status(500).send();
			} else {
				errLog(req, error, "Cannot delete product");
				res.status(500).send(); // Unknown error
			}
		} else {
			if (result.affectedRows == 0) {
				actLog(req, result, `Product ${productID} not found!`);
				res.status(404).send(`Product ${productID} not found!`);
			} else {
				actLog(req, result, "Product deleted!");
				res.status(204).send();
			}
		}
	});
});
// End of Product Endpoints
//----------------------------------------

//----------------------------------------
// Start of Review Endpoints

// Add New review [Done]
// http://localhost:3000/product/:id/review
app.post("/product/:id/review", function (req, res) {
	const productID = parseInt(req.params.id);
	if (isNaN(productID)) {
		console.log("Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	let data = {
		userid: req.body.userid, // must match the postman json body
		rating: req.body.rating,
		review: req.body.review,
		productID: productID,
	};

	Review.insert(data, function (err, result) {
		if (err) {
			errLog(req, err, "Review cannot add!");
			res.status(500).send(); // Unknown error
		} else {
			actLog(req, result, "Review added successfully!");
			res.status(201).send(`ID of the newly created listing:
                {"reviewid": ${result.insertId}}`);
		}
	});
});

// GET all the reviews of one particular product by product ID [Done]
// http://localhost:3000/product/2/reviews
app.get("/product/:id/reviews", function (req, res) {
	const productID = parseInt(req.params.id);
	if (isNaN(productID)) {
		console.log("Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	Review.getReviews(productID, function (err, result) {
		if (!err) {
			if (result.length == 0) {
				errLog(req, err, "No reviews for this product");
				res.status(404).send("No reviews for this product"); // This product doesn't have any review
			} else {
				actLog(req, result, "Reviews are retrieved!");
				res.status(200).send(result);
			}
		} else {
			errLog(req, err, "Cannot retrive reviews");
			res.status(500).end();
		}
	});
});

// End of Review Endpoints
//----------------------------------------

//----------------------------------------
// Start of Interest Endpoints

// POST New Interest [Done]
// http://localhost:3000/interest/:userid
app.post("/interest/:userid", function (req, res) {
	let uid = parseInt(req.params.userid);
	if (isNaN(uid)) {
		console.log("Input user id is NaN!");
		res.status(400).send("Invalid input"); // invalid input
		return;
	}

	let int = req.body.categoryids;
	Interest.add(uid, int, function (err, result) {
		if (!err) {
			actLog(req, result, "POST Interest");
			res.status(201).end(); // Created
		} else {
			errLog(req, err, "POST Interest");
			res.status(500).end(); // Unknown error
		}
	});
});

// End of Interest Endpoints
//----------------------------------------


//----------------------------------------
// Start of charts Endpoints
// GET interest chart [working]
// http://localhost:3000/interestChart
app.get("/interestChart", function (req, res) {
	if(req.get("KEY") == process.env.API_KEY_1 || req.get("KEY") == process.env.API_KEY_2 || req.get("KEY") == process.env.API_KEY_3){
        Chart.getInterChart(function (err, result) {
            if (!err) {
                // no internal error
                if (result.length == 0) {
                    actLog(req, result, "Interest database is empty");
                    res.status(404).send("Interest database is empty");
                } else {
                    actLog(req, result, "GET interest pie chart");

					res.status(200).sendFile(`charts/pieChart.PNG`, {
						root: "./",
					});
                    // res.status(200).send(result);
                }
            } else {
                errLog(req, err, "GET interest pie chart");
                res.status(500).end(); // internal error
            }
        });
    } else {
        errLog(req, err, "Not authorized");
        res.status(401).send("You are not authorized!");
    }

});

// End of charts Endpoints
//----------------------------------------



//----------------------------------------
// Start of Image Upload Endpoints

// POST New image 
// http://localhost:3000/upload
app.post("/upload", (req, res) => {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			errLog(req, err, "Multer Error");
			res.status(406).send(`Upload Error: ${err.message}`);
		} else if (err) {
			errLog(req, err, "Non-Multer Error from Multer");
			res.status(406).send(err.message);
		} else {
			console.log(req.file);
			res.status(200).sendFile(`uploads/${req.file.filename}`, {
				root: "./",
			}); //Received
		}
	});
	// res.status(200).send("received");
});

// End of Image Upload Endpoints
//----------------------------------------

//----------------------------------------
// Module Exports
//----------------------------------------
module.exports = app;
