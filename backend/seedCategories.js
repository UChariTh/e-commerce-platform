import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/category.model.js";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const categories = [
	{ name: "Jeans", slug: "jeans", imageUrl: "/jeans.jpg" },
	{ name: "T-shirts", slug: "t-shirts", imageUrl: "/tshirts.jpg" },
	{ name: "Shoes", slug: "shoes", imageUrl: "/shoes.jpg" },
	{ name: "Glasses", slug: "glasses", imageUrl: "/glasses.png" },
	{ name: "Jackets", slug: "jackets", imageUrl: "/jackets.jpg" },
	{ name: "Suits", slug: "suits", imageUrl: "/suits.jpg" },
	{ name: "Bags", slug: "bags", imageUrl: "/bags.jpg" },
];

const seedCategories = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for seeding...");

		await Category.deleteMany({}); // Optional: clear existing categories
		await Category.insertMany(categories);

		console.log("Categories seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding categories:", error.message);
		process.exit(1);
	}
};

seedCategories();
