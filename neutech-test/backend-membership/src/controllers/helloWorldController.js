const helloWorldValidator = require("../validators/helloWorldValidator");

module.exports.get = async ctx => {
  ctx.body = 'Hello World';
}

module.exports.post = async ctx => {
  const name = ctx.request.body.name;
  ctx.body = {greetings: `Hello ${name}`};
}