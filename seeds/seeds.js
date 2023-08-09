const mongoose = require("mongoose");
const axios = require("axios");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp2");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", () => {
	console.log("Database Terkoneksi!!");
});

const seedImage = async () => {
	try {
		const resp = await axios.get("https://api.unsplash.com/photos/random", {
			params: {
				client_id: "VAmh983R7CWnzMLx_eQhNSwpcOmJDjBRRcO8g-PvoyE",
				collections: 1114848,
			},
		});
		return resp.data.urls.regular;
	} catch (err) {
		console.log("eror rek!", err);
	}
};

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedsCamp = async () => {
	await Campground.deleteMany({});
	await Review.deleteMany({});
	for (let i = 0; i < 10; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 200) * 10000;
		const camp = new Campground({
			author: "64baa4b0f52219421d485d8d",
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			date: new Date(),
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			images: [
				{
					url: await seedImage(),
					filaname: "seeded image",
				},
			],
			price,
			description:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
		});
		await camp.save();
	}
};

seedsCamp();
