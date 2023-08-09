const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, verifyAuthor, validateCamp } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCamp,
		catchAsync(campgrounds.createCampground)
	);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(catchAsync(campgrounds.showCampDetails))
	.put(
		isLoggedIn,
		verifyAuthor,
		upload.array("image"),
		validateCamp,
		catchAsync(campgrounds.editCampground)
	)
	.delete(isLoggedIn, verifyAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
	"/:id/edit",
	isLoggedIn,
	verifyAuthor,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
