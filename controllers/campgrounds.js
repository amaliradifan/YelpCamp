const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, resp) => {
	const camps = await Campground.find();
	resp.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, resp) => {
	resp.render("campgrounds/new");
};

module.exports.createCampground = async (req, resp, next) => {
	//if (!req.body.campground) throw new ExpressError("Invalid Data", 400);
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	const camp = new Campground(req.body.campground);
	camp.geometry = geoData.body.features[0].geometry;
	camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.author = req.user._id;
	camp.date = new Date();
	await camp.save();
	req.flash("success", "Succesfully Make A New Campground!");
	resp.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampDetails = async (req, resp) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("author");
	if (!camp) {
		req.flash("error", "Cannot Find That Campground!");
		return resp.redirect("/campgrounds");
	}
	resp.render("campgrounds/details", { camp });
};

module.exports.renderEditForm = async (req, resp) => {
	const camp = await Campground.findById(req.params.id);
	if (!camp) {
		req.flash("error", "Cannot Find That Campground!");
		return resp.redirect("/campgrounds");
	}
	resp.render("campgrounds/edit", { camp });
};

module.exports.editCampground = async (req, resp) => {
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.images.push(...images);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			cloudinary.uploader.destroy(filename);
		}
		await camp.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	await camp.save();
	req.flash("success", "succesfully Updated Campground!");
	resp.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, resp) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully Deleted Campground!");
	resp.redirect("/campgrounds");
};
