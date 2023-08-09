const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const auth = require("../controllers/auth");
const catchAsync = require("../utilities/catchAsync");

router
	.route("/register")
	.get(auth.renderRegisterForm)
	.post(catchAsync(auth.createUser));

router
	.route("/login")
	.get(auth.renderLoginForm)
	.post(
		storeReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		auth.login
	);

router.get("/logout", auth.logout);

module.exports = router;
