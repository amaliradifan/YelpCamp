const User = require("../models/user");

module.exports.renderRegisterForm = (req, resp) => {
	resp.render("auth/register");
};

module.exports.createUser = async (req, resp) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Succesfully create new user! Welcome To Yelpcamp!");
			resp.redirect("/campgrounds");
		});
	} catch (e) {
		req.flash("error", e.message);
		resp.redirect("/register");
	}
};

module.exports.renderLoginForm = (req, resp) => {
	resp.render("auth/login");
};

module.exports.login = (req, resp) => {
	req.flash("success", "Welcome Back!");
	const redirectUrl = resp.locals.returnTo || "/campgrounds";
	resp.redirect(redirectUrl);
};

module.exports.logout = (req, resp, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Goodbye!");
		resp.redirect("/campgrounds");
	});
};
