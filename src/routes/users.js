const express = require("express");
const genValidator = require("../shared/validator");
const { isLoggedIn, hasRole } = require("../shared/auth");
const controllers = require("../controllers/users");
const schemas = require("../controllers/users/schemas");

const router = express.Router();

router.post(
  "/users",
  // isLoggedIn,
  genValidator(schemas.postUsersSchema),
  controllers.postUsers
);

router.get(
  "/users",
  isLoggedIn,
  hasRole(["super_admin"]),
  controllers.getUsers
);

router.get(
  "/users/:id",
  isLoggedIn,
  hasRole(["super_admin"]),
  controllers.showUsers
);

router.post(
  "/users/login",
  genValidator(schemas.loginUsersSchema),
  controllers.loginUsers
);

router.patch(
  "/users/:id",
  isLoggedIn,
  hasRole("super_admin", "admin", "user"),
  genValidator(schemas.patchUsersSchema),
  controllers.patchUsers
);

router.delete(
  "/users/:id",
  isLoggedIn,
  hasRole("super_admin"),
  controllers.deleteUsers
);

module.exports = router;
