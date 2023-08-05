const { postUsersSchema } = require("./post-users");
const { loginUsersSchema } = require("./login-users");
const { patchUsersSchema } = require("./patch-users");

module.exports = {
  postUsersSchema,
  loginUsersSchema,
  patchUsersSchema,
};
