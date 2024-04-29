const express = require("express");
const Router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");

Router.route("/").post(authenticateUser, createReview).get(getAllReviews);

Router.route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = Router;
