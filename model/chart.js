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

//----------------------------------------
// Configuration and set up for pie chart (interest category)
//----------------------------------------
{/* <canvas id="myChart" height="75"></canvas>
var src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"
var ctx = document.getElementById("Pie_chart");  */}

const pieData = {
    labels: ['C1: Red',
    'C2: Blue',
    'C3: Green',
    'C4: Dark purple',
    'C5: Light Green',
    'C6: Purple'], 

    datasets: [{
        label: 'Pie_chart',
        data: [],
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(145, 28, 156)',
        'rgb(139, 240, 208)',
        'rgb(157, 142, 237)'
        ],
        hoverOffset: 4
    }]
};

const pieChart = {
    type: 'pie',
    data: pieData,
};

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
                
				var sql =
					"SELECT fk_category_id FROM interest";
				conn.query(sql, function (err, result) {
					conn.end();
					if (err) {
						return callback(err, null);
					} else {
                        let countCate1 = 0, countCate2 = 0, countCate3 = 0, countCate4 = 0, countCate5 = 0, countCate6 = 0;
                        for(let i = 0; i < result.length; i++) {
                            switch(result[i].fk_category_id) {
                                case 1:
                                    countCate1++;
                                    break;
                                case 2:
                                    countCate2++;
                                    break;
                                case 3:
                                    countCate3++;
                                    break;
                                case 4:
                                    countCate4++;
                                    break;
                                case 5:
                                    countCate5++;
                                    break;
                                case 6:
                                    countCate6++;
                                    break;
                            }
                        }
                        result = [countCate1, countCate2, countCate3, countCate4, countCate5, countCate6];
                        for(let i = 0; i < result.length; i++) {
                            pieData.datasets[0].data[i] = result[i];
                        }
                        result = pieChart;
						return callback(null, result);
					}
				});
			}
		});
	},

	addCat: function (cat, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				return callback(err, null);
			} else {
				console.log("Connection established!");
				const sql = `
                           INSERT INTO
                                category(category, description)
                           VALUES
                                (?, ?) 
                           `;
				conn.query(
					sql,
					[cat.category, cat.description],
					(error, result) => {
						conn.end();
						if (error) {
							return callback(error, null);
						} else {
							return callback(null, result);
						}
					}
				);
			}
		});
	},
};

//----------------------------------------
// Module Export
//----------------------------------------
module.exports = Chart;
