import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./backend/models/user.model.js";
import path from "path";

dotenv.config();

const checkAdmin = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		const user = await User.findOne({ email: "admin@gmail.com" });
		if (user) {
			console.log("Admin User Found:");
			console.log("Name:", user.name);
			console.log("Email:", user.email);
			console.log("Role:", user.role);
		} else {
			console.log("Admin user NOT found!");
		}
		process.exit(0);
	} catch (error) {
		console.error("Error checking admin user:", error.message);
		process.exit(1);
	}
};

checkAdmin();
