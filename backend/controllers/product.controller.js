import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let imageUrl = "https://placehold.co/600x400?text=Product+Image";
		
		if (image) {
			if (typeof image === "string" && image.startsWith("data:image")) {
				// Local storage logic for base64
				try {
					const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
					const extension = image.split(";")[0].split("/")[1];
					const fileName = `product_${Date.now()}.${extension}`;
					const projectRoot = path.resolve(import.meta.dirname, "..", "..");
					const publicPath = path.join(projectRoot, "frontend", "public", "products");
					
					if (!fs.existsSync(publicPath)) {
						fs.mkdirSync(publicPath, { recursive: true });
					}
					
					const filePath = path.join(publicPath, fileName);
					fs.writeFileSync(filePath, base64Data, "base64");
					imageUrl = `/products/${fileName}`;
					console.log("Saved image locally:", imageUrl);
				} catch (error) {
					console.error("Error saving image locally:", error.message);
				}
			} else if (typeof image === "string" && image.includes("http")) {
				// If it's already a URL, use it
				imageUrl = image;
			} else {
				// Cloudinary logic as fallback
				try {
					if (
						process.env.CLOUDINARY_API_KEY &&
						!process.env.CLOUDINARY_API_KEY.includes("your_api_key")
					) {
						const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
						imageUrl = cloudinaryResponse.secure_url;
					}
				} catch (uploadError) {
					console.error("Error uploading to Cloudinary:", uploadError.message);
				}
			}
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: imageUrl,
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			if (product.image.startsWith("/products/")) {
				// Delete local file
				try {
					const fileName = product.image.split("/").pop();
					const projectRoot = path.resolve(import.meta.dirname, "..", "..");
					const filePath = path.join(projectRoot, "frontend", "public", "products", fileName);
					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath);
						console.log("Deleted local image:", fileName);
					}
				} catch (error) {
					console.error("Error deleting local image:", error.message);
				}
			} else if (product.image.includes("cloudinary")) {
				// Delete from Cloudinary
				const publicId = product.image.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`products/${publicId}`);
					console.log("Deleted image from Cloudinary");
				} catch (error) {
					console.log("Error deleting image from Cloudinary", error);
				}
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}
