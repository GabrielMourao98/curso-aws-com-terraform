const libValidator = require("lib-validator");

module.exports.greeting = libValidator.validadeWithSchema({
	type: "object",
	properties: {
		name: {type: "string"}
	},

	required: ["name"],
	additionalProperties: false
});
