import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./backend/models/user.model.js";
import Ticket from "./backend/models/ticket.model.js";
import ReturnRequest from "./backend/models/return.model.js";
import Order from "./backend/models/order.model.js";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const seedSupportData = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for support seeding...");

		// 1. Create Support User
		let supportUser = await User.findOne({ email: "support@gmail.com" });
		if (!supportUser) {
			supportUser = await User.create({
				name: "Support Staff",
				email: "support@gmail.com",
				password: "support123",
				role: "support",
			});
			console.log("Support user created!");
		}

		// 2. Find a Customer and an Order
		const customer = await User.findOne({ role: "customer" });
		const order = await Order.findOne({ user: customer?._id });

		if (customer) {
			// 3. Create Test Tickets
			await Ticket.deleteMany({});
			await Ticket.create([
				{
					user: customer._id,
					subject: "Missing item in my order",
					description: "I received my order #123 but the sunglasses are missing.",
					status: "Open",
					priority: "High",
				},
				{
					user: customer._id,
					subject: "How do I track my package?",
					description: "I can't find the tracking number anywhere.",
					status: "In Progress",
					priority: "Medium",
				},
				{
					user: customer._id,
					subject: "Broken screen on arrival",
					description: "The phone I ordered has a cracked screen.",
					status: "Open",
					priority: "Urgent",
				},
			]);
			console.log("Test tickets created!");

			if (order) {
				// 4. Create Test Return Requests
				await ReturnRequest.deleteMany({});
				await ReturnRequest.create([
					{
						order: order._id,
						user: customer._id,
						reason: "Size is too small",
						status: "Pending",
						amount: 49.99,
					},
					{
						order: order._id,
						user: customer._id,
						reason: "Changed my mind",
						status: "Pending",
						amount: 120.0,
					},
				]);
				console.log("Test return requests created!");
			}
		}

		console.log("Support data seeding complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding support data:", error.message);
		process.exit(1);
	}
};

seedSupportData();
