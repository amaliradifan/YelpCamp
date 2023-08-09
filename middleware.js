const ExpressError = require("./utilities/ExpressError");
const { campSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.storeReturnTo = (req, resp, next) => {
	if (req.session.returnTo) {
		resp.locals.returnTo = req.session.returnTo;
	}
	next();
};

module.exports.isLoggedIn = (req, resp, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You Must Logged In !");
		return resp.redirect("/login");
	}
	next();
};

module.exports.validateCamp = (req, resp, next) => {
	const { error } = campSchema.validate(req.body);
	if (error) {
		const message = error.details.map((elm) => elm.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

module.exports.verifyAuthor = async (req, resp, next) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp.author.equals(req.user._id)) {
		req.flash("error", "You Dont Have Permission To Do That!");
		return resp.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateReview = (req, resp, next) => {
	const { error } = reviewSchema.validate(req.body.review);
	if (error) {
		const message = error.details.map((elm) => elm.message).join(", ");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

module.exports.verifyReviewAuthor = async (req, resp, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You Dont Have Permission To Do That!");
		return resp.redirect(`/campgrounds/${id}`);
	}
	next();
};
