const Joi = require("@hapi/joi");
const { password } = require("./custom.validation");

const signup = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required().custom(password),
	}),
};

const login = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

module.exports = {
	signup,
	login,
};
