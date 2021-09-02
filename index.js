const APIv2_Router = require("./src/APIv2/APIv2.js");
const config = require("./src/util/config.js")

const express = require("express");
const server = express();
const port = config.port || 3000;

//Uses APIv2.js to route all traffic for /api/v2
server.use("/api/v2", APIv2_Router);

server.get("/api/v1*", async (req, res) => {
    res.status(410).send("ERROR: APIv1 has been deprecated and is no longer in use. Files have been permanently deleted off of the server. Please upgrade to APIv2")
});


//Start up server on specified port
server.listen(port, () => {
  console.log(`Calendar service listening on http://localhost:${port}`)
});