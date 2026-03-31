import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import path from "path";

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const createAdmin = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for admin creation...");

		const adminExists = await User.findOne({ email: "admin@gmail.com" });

		if (adminExists) {
			console.log("Admin account already exists. Updating role to admin...");
			adminExists.role = "admin";
			await adminExists.save();
			console.log("Admin account updated successfully!");
		} else {
			console.log("Creating new admin account...");
			await User.create({
				name: "admin",
				email: "admin@gmail.com",
				password: "admin123",
				role: "admin",
			});
			console.log("Admin account created successfully!");
		}

		process.exit(0);
	} catch (error) {
		console.error("Error creating admin account:", error.message);
		process.exit(1);
	}
};

createAdmin();
