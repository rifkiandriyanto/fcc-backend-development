"use strict";

const validate = require("../middlewares/validate");
const { authValidation, pollValidation } = require("../validations");
const { authController, pollController } = require("../controllers");

module.exports = function routes(app) {
	app.post(
		"/api/auth/login",
		validate(authValidation.login),
		authController.login
	);

	app.post(
		"/api/auth/signup",
		validate(authValidation.signup),
		authController.signup
	);

	app.post(
		"/api/polls",
		validate(pollValidation.createPoll),
		pollController.createPoll
	);

	app.get("/api/polls", pollController.getPolls);

	app.get(
		"/api/polls/:id",
		validate(pollValidation.getPoll),
		pollController.getPoll
	);

	app.put(
		"/api/polls/:id",
		validate(pollValidation.updatePoll),
		pollController.updatePoll
	);

	app.delete(
		"/api/polls/:id",
		validate(pollValidation.deletePoll),
		pollController.deletePoll
	);

	app.post(
		"/api/polls",
		validate(pollValidation.createPoll),
		pollController.createPoll
	);
};
