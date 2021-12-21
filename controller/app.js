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
const jwt = require("jsonwebtoken");

const { Console } = require("console"); // Import Console Module for generating log files
const fs = require("fs"); // Import File System Module

const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("../model/user.js");
const Category = require("../model/category.js");
const Interest = require("../model/interest.js");
const Product = require("../model/product.js");
const Review = require("../model/review.js");
const Image = require("../model/image.js");
const Chart = require("../model/chart.js");
const Login = require("../model/login.js");

//----------------------------------------
// Creating a Log File System
//----------------------------------------

const logger = new Console({
	// Create a new console object to handle stdout (logger.log) and stderr (logger.error)
	stdout: fs.createWriteStream("Activity_Log.log", { flags: "a" }),
	stderr: fs.createWriteStream("Error_Log.log", { flags: "a" }),
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
		}\nRequest Made: ${JSON.stringify(req.body)}\nOutput: ${note}\n${JSON.stringify(result)}\n`
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
		}\nRequest Made: ${JSON.stringify(req.body)}\nOutput: ${note}\n${JSON.stringify(err)}\n`
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
		let d = new Date();
		let date = d.getDate().toString() + d.getMonth().toString() + d.getFullYear().toString();
		let t =
			("0" + d.getHours()).slice(-2) +
			("0" + d.getMinutes()).slice(-2) +
			("0" + d.getSeconds()).slice(-2) +
			("00" + d.getMilliseconds()).slice(-3);
		let extension = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
		callback(null, `${date}-${t}_Product_${req.params.productID}.${extension}`);
	},
});
const fileFilter = (req, file, callback) => {
	// Reject a File
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		// Limit to JPG/PNG
		callback(null, true);
	} else {
		callback(new Error("Filetype Mismatched (Only accepts JPEG/JPG/PNG)"), false);
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
app.post("/users", async function (req, res) {
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
app.get("/users", authenticateToken, function (req, res) {
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
	let uid;
	if (!isNaN(req.params.id)) {
		uid = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input user id is NaN!");
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
	let uid;
	if (!isNaN(req.params.id)) {
		uid = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input user id is NaN!");
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
				actLog(req, result, "Existing row is set to its current values");
				res.status(200).send("Existing row is set to its current values"); // No changes as the changed info is same as previous one(existing row is set to its current values)
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
app.post("/category", authenticateToken, function (req, res) {
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

// Add new product to db [Done]
// http://localhost:3000/product
app.post("/product", authenticateToken, function (req, res) {
	Product.insert(req.body, function (err, result) {
		if (err) {
			errLog(req, err, "Cannot add new product");
			if (err.errno == 1062) {
				res.status(422).send();
			} else {
				res.status(500).send();
			}
		} else {
			actLog(req, result, "New product added");
			res.status(201).send(`ID of the newly created listing: \n{\n"productid": ${result.insertId}\n}`);
		}
	});
});

// Find the product by product ID [Done]
// http://localhost:3000/product/3
app.get("/product/:id", function (req, res) {
	let productID;
	if (!isNaN(req.params.id)) {
		productID = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input product id is NaN!");
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

				// to update the record clickTimes in db
				Chart.updateProDB(productID, function (err, result) {
					if (err) {
						errLog(req, err, "Product click times cannot update!");
						res.status(500).send(); // Unknown error
					} else {
						actLog(req, result, "Product click times update successfully!");
					}
				});

				res.status(200).send(result);
			}
		}
	});
});

// Delete the product by product ID [Done]
// http://localhost:3000/product/1
app.delete("/product/:id", authenticateToken, function (req, res) {
	let productID;
	if (!isNaN(req.params.id)) {
		productID = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}

	Product.delete(productID, (err, result) => {
		if (err) {
			errLog(req, err, "Cannot delete product");
			res.status(500).send(); // Unknown error
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
	let productID;
	if (!isNaN(req.params.id)) {
		productID = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input product id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}
	let data = {
		userid: req.body.userid, // must match the postman json body
		rating: req.body.rating,
		review: req.body.review,
		productID: productID,
	};
	if (isNaN(data.rating) || parseInt(data.rating) > 5 || parseInt(data.rating) < 1) {
		errLog(req, null, "Input for rating is invalid!");
		res.status(500).send();
		return;
	}
	Review.insert(data, function (err, result) {
		if (err) {
			errLog(req, err, "Review cannot add!");
			res.status(500).send(); // Unknown error
		} else {
			actLog(req, result, "Review added successfully!");
			res.status(201).send({ reviewid: result.insertId });
		}
	});
});

// GET all the reviews of one particular product by product ID [Problem]
// http://localhost:3000/product/2/reviews
app.get("/product/:id/reviews", function (req, res) {
	let productID;
	if (!isNaN(req.params.id)) {
		productID = parseInt(req.params.id);
	} else {
		errLog(req, null, "Input product id is NaN!");
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
	let uid;
	if (!isNaN(req.params.userid)) {
		uid = parseInt(req.params.userid);
	} else {
		errLog(req, null, "Input user id is NaN!");
		res.status(400).send("Invalid input");
		return;
	}
	if (!req.body.categoryids) {
		errLog(req, null, "Input category ids are invalid!");
		res.status(400).send("Invalid input");
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
// Start of Image Upload Endpoints

// GET Product Image
// http://localhost:3000/product/image/:productID
app.get("/product/image/:productID", (req, res) => {
	let productID;
	if (!isNaN(req.params.productID)) {
		productID = parseInt(req.params.productID);
	} else {
		errLog(req, null, "Input product id is NaN!");
		res.status(400).send("Invalid input for productID");
		return;
	}
	Image.get(productID, function (err, result) {
		if (!err) {
			actLog(req, result, "Image GET Request");
			res.status(200).sendFile(`uploads/${result}`, {
				root: "./",
			});
		} else if (err.message == "InvalidProductID") {
			errLog(req, err, "Image GET No Product in DB");
			res.status(404).send(`No product in database with ID = ${productID}`);
		} else if (err.message == "NoImage") {
			errLog(req, err, "Image GET No Image in DB");
			res.status(404).send(`No image in database for ${result}`);
		} else if (err.message == "ImageNotFound") {
			errLog(req, err, "Image GET Image is deleted/moved");
			res.status(404).send(`Image (${result}) could have been deleted OR moved`);
		} else {
			errLog(req, err, "Image GET Request failed");
			res.status(500).end();
		}
	});
});

// PUT Product Image
// http://localhost:3000/product/image/:productID
app.put("/product/image/:productID", authenticateToken, (req, res) => {
	let productID;
	if (!isNaN(req.params.productID)) {
		productID = parseInt(req.params.productID);
	} else {
		errLog(req, null, "Input product id is NaN!");
		res.status(400).send("Invalid input for productID");
		return;
	}
	let overwrite;
	if (!req.query.overwrite || isNaN(req.query.overwrite)) {
		overwrite = 0;
	} else {
		overwrite = parseInt(req.query.overwrite);
	}
	upload(req, res, function (err) {
		if (!req.file) {
			errLog(req, null, "No file was passed into Image PUT Request");
			res.status(406).send(`Upload Error: Missing Image`);
		} else {
			if (err instanceof multer.MulterError) {
				errLog(req, err, "Multer Error");
				if (err.message == "File too large") {
					res.status(406).send(`Upload Error: ${err.message} (Only accepts up to 1MB)`); // File too large
				} else {
					res.status(406).send(`Upload Error: ${err.message}`); // Multer Error
				}
			} else if (err) {
				errLog(req, err, "Non-Multer Error from Multer");
				res.status(406).send(`Upload Error: ${err.message}`); // Filetype Mismatched
			} else {
				Image.update(req.file.filename, productID, overwrite, function (err, result) {
					if (!err) {
						actLog(req.file, result, "Image updated");
						res.status(200).send("Image updated."); // Image Updated
					} else if (err.message == "InvalidProductID") {
						errLog(req.file, err, "Image PUT Request for invalid Product ID");
						if (fs.existsSync(`./uploads/${req.file.filename}`)) {
							fs.unlinkSync(`./uploads/${req.file.filename}`);
						}
						res.status(500).send(`No such product with ID = ${productID} in Database`);
					} else if (err.message == "ExistingFile") {
						errLog(req.file, err, "Existing Image in Database during Image PUT Request");
						if (fs.existsSync(`./uploads/${req.file.filename}`)) {
							fs.unlinkSync(`./uploads/${req.file.filename}`);
						}
						res.status(422).send(
							`Existing Image in Database for ${result.name}.\nTo overwrite system file, add query "overwrite=1"`
						);
					} else {
						errLog(req.file, err, "Image update failed");
						if (fs.existsSync(`./uploads/${req.file.filename}`)) {
							fs.unlinkSync(`./uploads/${req.file.filename}`);
						}
						res.status(500).send(); // Image update failed
					}
				});
			}
		}
	});
});

// End of Image Upload Endpoints
//----------------------------------------

//----------------------------------------
// Start of charts Endpoints

// GET interest chart [Done]
// http://localhost:3000/charts/interest
app.get("/charts/interest", authenticateToken, function (req, res) {
	Chart.getInterChart(function (err, result) {
		if (!err) {
			// no internal error
			if (result.length == 0) {
				actLog(req, result[0], "Interest database is empty");
				res.status(404).send("Interest database is empty");
			} else {
				actLog(req, result[0], "GET interest pie chart");
				console.log(result[1]);
				res.status(200).sendFile(`charts/${result[1]}`, {
					root: "./",
				});
			}
		} else {
			errLog(req, err, "GET interest pie chart");
			res.status(500).end(); // internal error
		}
	});
});

// GET price comparison chart for a specific category [Done]
// http://localhost:3000/charts/prices/:catID
app.get("/charts/prices/:catID", authenticateToken, function (req, res) {
	let catID;
	if (!isNaN(req.params.catID)) {
		catID = parseInt(req.params.catID);
	} else {
		errLog(req, null, "Input category id is NaN!");
		res.status(400).send("Invalid input for catID");
		return;
	}

	Chart.priComparChart(catID, function (err, result) {
		if (!err) {
			// no internal error
			if (result.length == 0) {
				actLog(req, result[0], "No product in this category");
				res.status(404).send("No product in this category");
			} else {
				actLog(req, result[0], "GET price comparison bar chart");
				console.log(result[1]); // result[1] is the image generated time
				res.status(200).sendFile(`charts/${result[1]}`, {
					root: "./",
				});
			}
		} else {
			errLog(req, err, "GET price comparison bar chart");
			res.status(500).end(); // internal error
		}
	});
});

// GET line chart for click times of a specific product [Done]
// http://localhost:3000/charts/click
app.get("/charts/click", authenticateToken, function (req, res) {
	Chart.clickTimesChart(function (err, result) {
		if (!err) {
			// no internal error
			if (result.length == 0) {
				actLog(req, result[0], "No products");
				res.status(404).send("No products");
			} else {
				actLog(req, result[0], "GET click times line chart for products");
				console.log(result[1]); // result[1] is the image generated time
				res.status(200).sendFile(`charts/${result[1]}`, {
					root: "./",
				});
			}
		} else {
			errLog(req, err, "GET clcik times line chart");
			res.status(500).end(); // internal error
		}
	});
});

// Delete the charts [Done]
// http://localhost:3000/charts
app.delete("/charts", authenticateToken, function (req, res) {
	fs.readdir("./charts", (err, files) => {
		if (err) {
			console.log(err);
			res.status(500).send("Cannot delete charts");
		} else {
			for (let i = 0; i < files.length; i++) {
				fs.unlinkSync(`./charts/${files[i]}`);
			}
			fs.readdir("./charts", (err, files) => {
				// check if there still get exist charts
				if (err) {
					console.log(err);
					res.status(500).send("Cannot delete charts");
				} else {
					if (files.length == 0) {
						res.status(200).send("Charts deleted!");
					} else {
						res.status(500).send("Cannot delete charts");
					}
				}
			});
		}
	});
});
// End of charts Endpoints
//----------------------------------------

//----------------------------------------
// Start of Login/API Key Endpoints
// GET Token [working]
// http://localhost:3000/login

app.post("/login", function (req, res) {
	let loginData = {
		user: req.body.username,
		pass: req.body.password,
	};
	Login.authenticate(loginData, function (err, result) {
		if (err) {
			res.status(500).send("Internal Server Error!");
		} else if (result.length == 0) {
			res.status(401).send("User does not exist!");
		} else if (result[0].password != loginData.pass) {
			res.status(401).send("Invalid Password!");
		} else if (result[0].type == "Customer") {
			res.status(403).send("You are not allowed to access Admin API Keys.");
		} else {
			delete loginData.pass;
			let accessToken;
			if (result[0].type == "SuperAdmin") {
				accessToken = jwt.sign(loginData, process.env.SECRET_KEY);
			} else {
				accessToken = jwt.sign(loginData, process.env.SECRET_KEY, {
					expiresIn: process.env.TOKEN_EXPIRY,
				});
			}
			res.json({ accessToken: accessToken });
		}
	});
});

// End of Login/API Key Endpoints
//----------------------------------------

//----------------------------------------
// Authentication Middleware

function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.status(401).send();

	jwt.verify(token, process.env.SECRET_KEY, (err, loginData) => {
		if (err) return res.status(403).send();
		req.username = loginData.user;
		next();
	});
}

// Authentication Middleware
//----------------------------------------

//----------------------------------------
// Module Exports
//----------------------------------------
module.exports = app;
