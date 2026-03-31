import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({});
		res.json(categories);
	} catch (error) {
		console.log("Error in getAllCategories controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createCategory = async (req, res) => {
	try {
		const { name, image } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
		}

		const slug = name.toLowerCase().split(" ").join("-");

		const category = await Category.create({
			name,
			slug,
			imageUrl: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
		});

		res.status(201).json(category);
	} catch (error) {
		console.log("Error in createCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		if (category.imageUrl) {
			const publicId = category.imageUrl.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`categories/${publicId}`);
			} catch (error) {
				console.log("error deleting image from cloudinary", error);
			}
		}

		await Category.findByIdAndDelete(req.params.id);

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.log("Error in deleteCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
