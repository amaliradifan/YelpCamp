const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
	url: String,
	filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_300");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
	{
		title: String,
		images: [imageSchema],
		price: Number,
		description: String,
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		location: String,
		date: Date,
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
	},
	opts
);

CampgroundSchema.virtual("properties.popupMarkup").get(function () {
	return `<div style="text-align : center;"><strong ><a href="/campgrounds/${this._id}">${this.title}</a></strong><br>
	<a href="/campgrounds/${this._id}"><img src="${this.images[0].url}" style = "width :70%; height: auto;"alt=""></a></div>`;
});

CampgroundSchema.virtual("campDate").get(function () {
	const campDate = this.date;
	const currDate = new Date();
	let dateDiff = currDate - campDate;
	dateDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
	const date = campDate.getDate();
	const month = campDate.getMonth() + 1;
	const year = campDate.getFullYear();
	if (dateDiff < 7) {
		return `${dateDiff} Days ago`;
	} else if (dateDiff < 30) {
		return `${Math.floor(dateDiff / 7)} Weeks Ago`;
	} else {
		return (formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
			date < 10 ? "0" : ""
		}${date}`);
	}
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
