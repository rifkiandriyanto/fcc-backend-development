const bcrypt = require("bcrypt");

const saltRounds = 10;

async function encryptData(string) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(string, salt);
	return hash;
}

async function decryptData(string, hash) {
	const match = await bcrypt.compare(string, hash);
	return match;
}

module.exports = { encryptData, decryptData };
