import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./backend/models/product.model.js";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const products = await Product.find({});
        console.log("Found", products.length, "products.");
        
        products.forEach(p => {
            console.log(`Product: ${p.name}, Image: ${p.image}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error checking products:", error.message);
        process.exit(1);
    }
};

checkProducts();
