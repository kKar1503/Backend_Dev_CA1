//----------------------------------------
// imports
//----------------------------------------
const app = require("./controller/app");

//----------------------------------------
// config
//----------------------------------------
var port = 3000;
var hostname="localhost";

//----------------------------------------
// main
//----------------------------------------

app.listen(port, hostname, () => {
    console.log(`Server started and accessible via http://${hostname}:${port}/`);
  });