module.exports.getCampDate = (campDate) => {
	const date = campDate.getDate();
	const month = campDate.getMonth() + 1;
	const year = campDate.getFullYear();
	return `${year}-${month < 10 ? "0" : ""}${month}-${
		date < 10 ? "0" : ""
	}${date}`;
};
