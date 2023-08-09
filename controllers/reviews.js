const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, resp) => {
	const camp = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	camp.reviews.push(review);
	await review.save();
	await camp.save();
	req.flash("success", "Created New Review!");
	resp.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, resp) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: { reviewId } },
	});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully Deleted Review");
	resp.redirect(`/campgrounds/${id}`);
};
