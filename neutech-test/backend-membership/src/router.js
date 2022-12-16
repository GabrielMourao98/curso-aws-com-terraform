const Router = require('koa-router');
const {validatorAsMiddleware} = require("lib-validator");
const helloWorldController = require("./controllers/helloWorldController");
const helloWorldValidator = require("./validators/helloWorldValidator");

const router = new Router();

router.get("/", helloWorldController.get);
router.post("/", 
	validatorAsMiddleware(helloWorldValidator.greeting), 
	helloWorldController.post);

module.exports.router = router;