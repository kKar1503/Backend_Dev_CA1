//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        chart.js
//----------------------------------------

//----------------------------------------
// Imports
//----------------------------------------
const db = require("./databaseConfig.js");
const fs = require("fs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
var randomColor = require("randomcolor"); // import the script
const width = 400; //px
const height = 400; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

//-------------------------------------

//----------------------------------------
// Main Code Implementations
//----------------------------------------
let Chart = {
	getInterChart: function (callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				return callback(err, null); // connection err
			} else {
				console.log("Connection established!");

				var interestSQL = "SELECT fk_category_id FROM interest"; // sql to change to a join table query with category table to get category name
				conn.query(interestSQL, function (err, result) {
					if (err) {
						conn.end();
						return callback(err, null);
					} else {
						// create and initialize the countCate and labels array
						let highest = result[0].fk_category_id;
						for (let i = 0; i < result.length; i++) {
							if (result[i].fk_category_id > highest) {
								highest = result[i].fk_category_id;
							}
						}

						let countCate = [];
						for (let i = 0; i < highest; i++) {
							countCate.push(0);
						}

						for (let i = 0; i < result.length; i++) {
							countCate[result[i].fk_category_id - 1] += 1;
						}
						// create and initialize labels array
						let labels = [];

						var categorySQL = "SELECT DISTINCT category FROM category"; // sql to change to a join table query with category table to get category name
						conn.query(categorySQL, function (err, result) {
							conn.end();
							if (err) {
								return callback(err, null);
							} else {
								for (let i = 0; i < result.length; i++) {
									labels.push(result[i].category + " (" + countCate[i] + ")");
								}
								let colors = [];
								colors = randomColor({
									count: labels.length,
									format: "rgb",
									hue: "blue",
								});

								let filename;
								//----------------------------------------
								// Configuration and set up for pie chart (interest category)
								//----------------------------------------
								(async () => {
									let configuration = {
										type: "pie",
										data: {
											labels: [],

											datasets: [
												{
													label: "Pie_chart",
													data: [],
													backgroundColor: [],
													hoverOffset: 4,
												},
											],
										},
									};

									// build the configuration
									configuration.data.datasets[0].data = countCate;
									configuration.data.labels = labels;
									configuration.data.datasets[0].backgroundColor = colors;

									let imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
									filename = new Date().toISOString().replace(/:/g, "-") + " - " + "pieChart.PNG";

									// Write image to file
									fs.writeFileSync(`./charts/${filename}`, imageBuffer);
									return callback(null, [result, filename]);
								})();
							}
						});
					}
				});
			}
		});
	},

	priComparChart: function (productCateID, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = "SELECT name, price FROM product WHERE categoryid = ?";
				conn.query(sql, [productCateID], (error, result) => {
					conn.end();
					if (error) {
						return callback(error, null);
					} else {
						let prices = [];
						for (let i = 0; i < result.length; i++) {
							prices.push(result[i].price);
						}

						let labels = [];
						for (let i = 0; i < result.length; i++) {
							labels.push(result[i].name);
						}

						let backgroundColors = [];
						backgroundColors = randomColor({
							count: labels.length,
							format: "rgb",
							hue: "blue",
						});

						let borderColors = [];
						borderColors = randomColor({
							count: labels.length,
							format: "rgb",
							hue: "green",
						});
						//----------------------------------------
						// Configuration and set up for pie chart (interest category)
						//----------------------------------------
						(async () => {
							let configuration = {
								type: "bar",
								data: {
									labels: [],
									datasets: [
										{
											label: "Price Comparison bar chart for category " + productCateID,
											data: [],
											backgroundColor: [],
											borderColor: [],
											borderWidth: 1,
										},
									],
								},
								options: {
									scales: {
										y: {
											beginAtZero: true,
										},
									},
								},
							};

							// build the configuration
							configuration.data.datasets[0].data = prices;
							configuration.data.labels = labels;
							configuration.data.datasets[0].backgroundColor = backgroundColors;
							configuration.data.datasets[0].borderColor = borderColors;

							let imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
							filename = new Date().toISOString().replace(/:/g, "-") + " - " + "barChart.PNG";

							// Write image to file
							fs.writeFileSync(`./charts/${filename}`, imageBuffer);
							return callback(null, [result, filename]);
						})();
					}
				});
			}
		});
	},

	updateProDB: function (productID, callback) {
		var dbConn = db.getConnection();
		dbConn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = `
							UPDATE 
								product 
							SET 
								clickTimes = clickTimes + 1
							WHERE
								productid = ?;`;
				dbConn.query(sql, [productID], (error, result) => {
					dbConn.end();
					if (error) {
						return callback(error, null);
					}
					return callback(null, result);
				});
			}
		});
	},

	clickTimesChart: function (callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				const sql = "SELECT click_times, name FROM product";
				conn.query(sql, (error, result) => {
					conn.end();
					if (error) {
						return callback(error, null);
					} else {
						let clickTimes = [];
						for (let i = 0; i < result.length; i++) {
							clickTimes.push(result[i].click_times);
						}

						let labels = [];
						for (let i = 0; i < result.length; i++) {
							labels.push(result[i].name);
						}

						let backgroundColors = [];
						backgroundColors = randomColor({
							count: labels.length,
							format: "rgb",
							hue: "blue",
						});

						let borderColors = [];
						borderColors = randomColor({
							count: labels.length,
							format: "rgb",
							hue: "green",
						});

						//----------------------------------------
						// Configuration and set up for pie chart (interest category)
						//----------------------------------------
						(async () => {
							let configuration = {
								type: "bar",
								data: {
									labels: [],
									datasets: [
										{
											label: "Product click times chart",
											data: [],
											backgroundColor: [],
											borderColor: [],
											borderWidth: 1,
										},
									],
								},
								options: {
									scales: {
										y: {
											beginAtZero: true,
										},
									},
								},
							};

							// build the configuration
							configuration.data.datasets[0].data = clickTimes;
							configuration.data.labels = labels;
							configuration.data.datasets[0].backgroundColor = backgroundColors;
							configuration.data.datasets[0].borderColor = borderColors;

							let imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
							filename = new Date().toISOString().replace(/:/g, "-") + " - " + "barChart.PNG";

							// Write image to file
							fs.writeFileSync(`./charts/${filename}`, imageBuffer);
							return callback(null, [result, filename]);
						})();
					}
				});
			}
		});
	},
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Chart;
