const express = require("express");
const server = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");

// console.log("console.log(server): ", server);

server.use(express.urlencoded({extended: true, limit: "50mb"})); // express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
server.use(express.json({limit: "50mb"})); // express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
server.use(cookieParser());
server.use(morgan("dev"));
server.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','DELETE','PUT', 'OPTIONS']
}));

server.use("/", routes);

server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    return res.status(status).send(message);
})

module.exports = server;