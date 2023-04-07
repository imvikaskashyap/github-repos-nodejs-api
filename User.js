const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userId: { type: Number, unique: true },
	name: String,
	email: String,
	password: String,
	phone: Number,
	address: String,
	profilePicture: String,
	qualification: String,
	role: { type: String, enum: ["user", "admin"], default: "user" },
	status: {
		type: String,
		enum: ["pending", "approved", "rejected"],
		default: "pending",
	},
});

userSchema.pre("save", async function (next) {
	const user = this;
	if (!user.isNew) {
		return next();
	}
	try {
		const lastUser = await mongoose
			.model("users", userSchema)
			.findOne({})
			.sort({ userId: -1 })
			.exec();
		user.userId = lastUser ? lastUser.userId + 1 : 1;
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("users", userSchema);
