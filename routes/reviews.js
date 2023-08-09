const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsync = require("../utilities/catchAsync");
const {
	validateReview,
	isLoggedIn,
	verifyReviewAuthor,
} = require("../middleware");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete(
	"/:reviewId",
	isLoggedIn,
	verifyReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
