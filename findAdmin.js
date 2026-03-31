import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./backend/models/user.model.js";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const findAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            console.log("Admin found:", admin.email);
        } else {
            console.log("No admin found");
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

findAdmin();
