import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Open", "In Progress", "Resolved"],
			default: "Open",
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High", "Urgent"],
			default: "Low",
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
	},
	{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
