import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./backend/models/product.model.js";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const fixProductLinks = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for fixing links...");

		const oldPlaceholder = "https://via.placeholder.com/300";
		const newPlaceholder = "https://placehold.co/600x400?text=Product+Image";

		const result = await Product.updateMany(
			{ image: oldPlaceholder },
			{ image: newPlaceholder }
		);

		console.log(`Updated ${result.modifiedCount} products with broken placeholder links.`);
		
		process.exit(0);
	} catch (error) {
		console.error("Error fixing product links:", error.message);
		process.exit(1);
	}
};

fixProductLinks();
