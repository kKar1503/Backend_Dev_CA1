//----------------------------------------
// BackEnd Web Development Assignment 1
// Students:        Li Kehan & Yam Kar Lok
// Admission No:    P2111575 & P2123181
// Class:           DIT/FT/1B/04
// Filename:        category.js
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

						var categorySQL =
							"SELECT DISTINCT category FROM category"; // sql to change to a join table query with category table to get category name
						conn.query(categorySQL, function (err, result) {
							conn.end();
							if (err) {
								return callback(err, null);
							} else {
								for (let i = 0; i < result.length; i++) {
									labels.push(result[i].category);
								}
								let colors = [];
								for (let i = 0; i < labels.length; i++) {
									colors[i] = randomColor({
										count: 1,
										format: "rgb",
									});
								}
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
									configuration.data.datasets[0].data =
										countCate;
									configuration.data.labels = labels;
									configuration.data.datasets[0].backgroundColor =
										colors;

									console.log(configuration);
									console.log(
										configuration.data.datasets[0].data
									);
									console.log(
										configuration.data.datasets[0]
											.backgroundColor
									);

									let imageBuffer =
										await chartJSNodeCanvas.renderToBuffer(
											configuration
										);
									filename =
										new Date()
											.toISOString()
											.replace(/:/g, "-") +
										" - " +
										"pieChart.PNG";
									console.log(filename);

									// Write image to file
									fs.writeFileSync(
										`./charts/${filename}`,
										imageBuffer
									);
									return callback(null, [result, filename]);
								})();
							}
						});
					}
				});
			}
		});
	},

	// addCat: function (cat, callback) {
	// 	var conn = db.getConnection();
	// 	conn.connect(function (err) {
	// 		if (err) {
	// 			return callback(err, null);
	// 		} else {
	// 			console.log("Connection established!");
	// 			const sql = `
	//                        INSERT INTO
	//                             category(category, description)
	//                        VALUES
	//                             (?, ?)
	//                        `;
	// 			conn.query(
	// 				sql,
	// 				[cat.category, cat.description],
	// 				(error, result) => {
	// 					conn.end();
	// 					if (error) {
	// 						return callback(error, null);
	// 					} else {
	// 						return callback(null, result);
	// 					}
	// 				}
	// 			);
	// 		}
	// 	});
	// },
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Chart;
