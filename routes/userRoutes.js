const express = require("express");
const Router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controllers/userControllers");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

Router.route("/").get(
  authenticateUser,
  authorizePermissions("admin"),
  getAllUsers
);

Router.route("/showMe").get(authenticateUser, showCurrentUser);
Router.route("/updateUser").patch(authenticateUser, updateUser);
Router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

// all teh above route should come before id , otherwise it will throw not found route. bcz it will add id beforre the route
Router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = Router;
