"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const apiRoutes = require("./routes/api.js");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");
const { errorConverter, errorHandler } = require("./middlewares/error.js");
const config = require("./config/config.js");

const app = express();

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				styleSrc: [
					"'self'",
					"'unsafe-inline'",
					"https://fcc-voting-app.herokuapp.com/",
				],
				scriptSrc: [
					"'self'",
					"'unsafe-inline'",
					"https://fcc-voting-app.herokuapp.com/",
					"https://cloud.iexapis.com/",
					"https://code.jquery.com/jquery-3.6.0.min.js",
					"https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js",
				],
			},
		},
		xssFilter: true,
		nocache: true,
		noSniff: true,
		hidePoweredBy: true,
		// frameguard: {
		//   action: "deny",
		// },
	})
);

app.use("/public", express.static(process.cwd() + "/public"));
// app.use("/views", express.static(process.cwd() + "/views"));

app.route("/").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});
// TODO: Add midleware to all routes below
app.route("/login").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/login.html");
});
app.route("/signup").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/signup.html");
});
app.route("/new-poll").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/new-poll.html");
});
app.route("/polls").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/my-polls.html");
});
app.route("/polls/:id").get(function (_req, res) {
	res.sendFile(process.cwd() + "/views/poll.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

app.use(function (_req, res) {
	res.status(404).type("text").send("Not Found");
});

mongoose.connect(config.db.uri, config.db.options).then(() => {
	console.log("Connected to mongodb");

	//Start our server and tests!
	app.listen(process.env.PORT || 3000, function () {
		console.log("Listening on port " + process.env.PORT);
		if (process.env.NODE_ENV === "test") {
			console.log("Running Tests...");
			setTimeout(function () {
				try {
					runner.run();
				} catch (e) {
					var error = e;
					console.log("Tests are not valid:");
					console.log(error);
				}
			}, 1500);
		}
	});
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app; //for testing
