const express = require("express");
require("./db.config");
const User = require("./User");
const app = express();
const PORT = process.env.PORT || 8081;

app.get("/", async (req, res) => {
	res.send("Hello Node js");
	res.end();
});

app.get("/users/:userId", async (req, res) => {
	try {
		const user = await User.findOne({
			userId: req.params.userId,
		}).lean();
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		const { _id, ...rest } = user;
		const userWithTimestamp = {
			...rest,
			timestamp: _id.getTimestamp(),
		};
		res.json(userWithTimestamp);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});
