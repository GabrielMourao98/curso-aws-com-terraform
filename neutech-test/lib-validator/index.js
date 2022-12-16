const Ajv = require("ajv");
const ajv = new Ajv();

module.exports.validadeWithSchema = schema => {

	const validate = ajv.compile(schema);

	return data => ({
		valid: validate(data),
		errors: validate.errors || {}
	})
}

module.exports.validatorAsMiddleware = validator => {

	return async (ctx, next) => {
		const {valid, errors} = validator(ctx.request.body);

		if(!valid) {
			ctx.throw(400, errors)
		} else {
			await next();
		}
	}
}