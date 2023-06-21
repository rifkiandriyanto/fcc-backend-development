const { Poll } = require("../models");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

exports.getPolls = catchAsync(async (req, res) => {
	const userId = req.query.user_id;
	if (userId) {
		const polls = await Poll.find({ created_by: userId }).populate([
			{
				path: "created_by",
				select: "username",
			},
		]);
		return res.json(polls || []);
	}

	const polls = await Poll.find({}).populate([
		{
			path: "created_by",
			select: "username",
		},
	]);

	res.json(polls || []);
});

exports.getPoll = catchAsync(async (req, res) => {
	const id = req.params.id;
	const poll = await Poll.findOne({ _id: id }).populate([
		{
			path: "created_by",
			transform: (doc) =>
				doc == null ? null : { username: doc.username },
		},
	]);
	if (!poll) throw new ApiError(404, "Poll not found");
	res.json(poll);
});

exports.updatePoll = catchAsync(async (req, res) => {
	const id = req.params.id;
	const { user_id: userId, option } = req.body;

	const poll = await Poll.findOne({
		_id: id,
		"options.name": option,
	});

	if (poll) {
		await Poll.findOneAndUpdate(
			{
				_id: id,
				"options.name": option,
			},
			{
				$addToSet: {
					"options.$.votes": [userId],
				},
			}
		);
	} else {
		await Poll.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$push: {
					options: {
						votes: [userId],
						name: option,
					},
				},
			}
		);
	}

	res.json("success");
});

exports.deletePoll = catchAsync(async (req, res) => {
	const id = req.params.id;
	const deletedPoll = await Poll.findByIdAndDelete(id);
	if (!deletedPoll) throw new ApiError(404, "Poll not found");
	res.json("success");
});

exports.createPoll = catchAsync(async (req, res) => {
	const { user_id: userId, question, options: optionString } = req.body;

	const options = optionString
		.split(",")
		.map((option) => ({ name: option, votes: [] }));

	const createdPoll = await Poll.create({
		created_by: userId,
		question,
		options,
	});

	res.json(createdPoll);
});
