
//----------------------------------------
// Start of charts Endpoints
// GET interest chart [working]
// http://localhost:3000/interestChart
app.get("/interestChart", function (req, res) {
    //-------------------------------------
//[working]
//-------------------------------------
// Access the response data JSON as a JavaScript object
res = pm.response.json();

// -----------------------------
// - Structure data for charts -
// -----------------------------

// EDIT THIS OBJECT TO BIND YOUR DATA
const vizData = {
    
    // Labels take an array of strings
    labels: res.data.labels,
    
    // Data takes an array of numbers
    data: res.data.data
};

// ------------
// - Template -
// ------------

// Configure the template
var template = `
<canvas id="pieChart" style="width:100%;max-width:600px"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>    

<script>
    // Get DOM element to render the chart in
    var ctx = document.getElementById("pieChart");

    // Configure Chart JS here.
    // You can customize the options passed to this constructor to
    // make the chart look and behave the way you want
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
            'Red',
            'Blue',
            'Yellow'
            ],
            datasets: [{
            label: 'Interest pie chart',
            data: [1,2,3],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
            }]
        }
    });

    // Access the data passed to pm.visualizer.set() from the JavaScript
    // code of the Visualizer template
    pm.getData(function (err, value) {
        myChart.data.datasets[0].data = value.data;
        myChart.data.labels = value.labels;
        myChart.update();
    });

</script>`;

// // -------------------------
// // - Bind data to template -
// // -------------------------

// Set the visualizer template
pm.visualizer.set(template, vizData);


//-------------------------------------
    if(req.get("KEY") == process.env.API_KEY_1 || req.get("KEY") == process.env.API_KEY_2 || req.get("KEY") == process.env.API_KEY_3){
        Chart.getInterChart(function (err, result) {
            if (!err) {
                // no internal error
                if (result.length == 0) {
                    actLog(req, result, "Interest database is empty");
                    res.status(404).send("Interest database is empty");
                } else {
                    actLog(req, result, "GET interest pie chart");
                    res.status(200).send(result);
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




// Access the response data JSON as a JavaScript object
const res = pm.response.json();

// -----------------------------
// - Structure data for charts -
// -----------------------------

// EDIT THIS OBJECT TO BIND YOUR DATA
const vizData = {
    
    // Labels take an array of strings
    labels: res.data.labels,
    
    // Data takes an array of numbers
    data: res.data.data
};

// ------------
// - Template -
// ------------

// Configure the template
var template = `
<canvas id="myChart" height="75"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script> 

<script>
    var ctx = document.getElementById("myChart");

    var myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ['C1: Red',
                    'C2: Blue',
                    'C3: Green',
                    'C4: Dark purple',
                    'C5: Light Green',
                    'C6: Purple'], 
            datasets: [{
                data: [3,5,5,2,4,3], 
                
                backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(78, 205, 86)',
                'rgb(145, 28, 156)',
                'rgb(139, 240, 208)',
                'rgb(157, 142, 237)'
                ]
            }]
        }
    });

    pm.get("/interestChart",function (err, value) {
        myChart.data.datasets[0].data = value.data;
        myChart.data.labels = value.labels;
        myChart.update();
    });
</script>`;

// -------------------------
// - Bind data to template -
// -------------------------

// Set the visualizer template
pm.visualizer.set(template, vizData);



const Chart = require("../model/chart.js");

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
