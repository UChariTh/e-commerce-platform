import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	categories: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to create product");
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data?.products || [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data?.products || [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
	fetchCategories: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/categories");
			set({ categories: response.data || [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch categories", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch categories");
		}
	},
	createCategory: async (categoryData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/categories", categoryData);
			set((prevState) => ({
				categories: [...prevState.categories, res.data],
				loading: false,
			}));
			toast.success("Category created successfully");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to create category");
			set({ loading: false });
		}
	},
	deleteCategory: async (categoryId) => {
		set({ loading: true });
		try {
			await axios.delete(`/categories/${categoryId}`);
			set((prevState) => ({
				categories: prevState.categories.filter((cat) => cat._id !== categoryId),
				loading: false,
			}));
			toast.success("Category deleted successfully");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to delete category");
			set({ loading: false });
		}
	},
}));
