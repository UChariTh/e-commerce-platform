import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const AdminCategories = () => {
	const [newCategory, setNewCategory] = useState({
		name: "",
		image: "",
	});

	const { createCategory, fetchCategories, categories, deleteCategory, loading } = useProductStore();

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createCategory(newCategory);
			setNewCategory({ name: "", image: "" });
		} catch {
			console.log("error creating a category");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewCategory({ ...newCategory, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

	return (
		<div className='max-w-4xl mx-auto'>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='text-2xl font-semibold mb-6 text-primary-300'>Add New Category</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
							Category Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newCategory.name}
							onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
							required
						/>
					</div>

					<div className='mt-1 flex items-center'>
						<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
						<label
							htmlFor='image'
							className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
						>
							<Upload className='h-5 w-5 inline-block mr-2' />
							Upload Category Image
						</label>
						{newCategory.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
					</div>

					<button
						type='submit'
						className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50'
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
								Loading...
							</>
						) : (
							<>
								<PlusCircle className='mr-2 h-5 w-5' />
								Create Category
							</>
						)}
					</button>
				</form>
			</motion.div>

			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg p-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<h2 className='text-2xl font-semibold mb-6 text-primary-300'>Current Categories</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{categories?.length > 0 ? (
						categories.map((category) => (
							<div key={category._id} className='bg-gray-700 rounded-lg p-4 relative group'>
								<img
									src={category.imageUrl}
									alt={category.name}
									className='w-full h-32 object-cover rounded-md mb-2'
								/>
								<h3 className='text-white font-medium'>{category.name}</h3>
								<button
									onClick={() => deleteCategory(category._id)}
									className='absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700'
								>
									<Trash className='h-4 w-4 text-white' />
								</button>
							</div>
						))
					) : (
						<p className='text-center text-gray-400 col-span-full'>No categories found.</p>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default AdminCategories;
