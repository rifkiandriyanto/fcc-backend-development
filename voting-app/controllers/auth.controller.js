const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { encryptData, decryptData } = require("../utils/auth");

exports.login = catchAsync(async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user || !user.toJSON() || !user.password) {
		throw new ApiError(400, "Incorrect username or password");
	}

	const match = await decryptData(password, user.password);
	if (!match) {
		throw new ApiError(400, "Incorrect username or password");
	}

	delete user.password;
	res.json(user);
});

exports.signup = catchAsync(async (req, res) => {
	const { username, password } = req.body;

	const existedUser = await User.findOne({ username });

	if (existedUser && existedUser.toJSON()) {
		throw new ApiError(409, "User already existed");
	}

	const hashPassword = await encryptData(password);

	if (!hashPassword) throw new ApiError(500, "Server error");

	const user = await User.create({ username, password: hashPassword });
	if (!user) throw new ApiError(500, "Server error");

	delete user.password;
	res.json(user);
});
