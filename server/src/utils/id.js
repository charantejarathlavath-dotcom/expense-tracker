const { customAlphabet } = require("nanoid");

const generateId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

module.exports = { generateId };
