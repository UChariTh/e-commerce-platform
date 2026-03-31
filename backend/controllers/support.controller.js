import Ticket from "../models/ticket.model.js";
import ReturnRequest from "../models/return.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSupportMetrics = async (req, res) => {
	try {
		const totalTickets = await Ticket.countDocuments();
		const pendingIssues = await Ticket.countDocuments({ status: "Open" });
		const inProgressIssues = await Ticket.countDocuments({ status: "In Progress" });
		const resolvedCases = await Ticket.countDocuments({ status: "Resolved" });
		const pendingReturns = await ReturnRequest.countDocuments({ status: "Pending" });

		res.json({
			totalTickets,
			pendingIssues,
			inProgressIssues,
			resolvedCases,
			pendingReturns,
		});
	} catch (error) {
		console.log("Error in getSupportMetrics controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllTickets = async (req, res) => {
	try {
		const tickets = await Ticket.find({}).populate("user", "name email").sort({ createdAt: -1 });
		res.json(tickets);
	} catch (error) {
		console.log("Error in getAllTickets controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateTicketStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		res.json(ticket);
	} catch (error) {
		console.log("Error in updateTicketStatus controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllReturns = async (req, res) => {
	try {
		const returns = await ReturnRequest.find({})
			.populate("user", "name email")
			.populate("order")
			.sort({ createdAt: -1 });
		res.json(returns);
	} catch (error) {
		console.log("Error in getAllReturns controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateReturnStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const returnReq = await ReturnRequest.findByIdAndUpdate(id, { status }, { new: true });
		if (!returnReq) {
			return res.status(404).json({ message: "Return request not found" });
		}

		res.json(returnReq);
	} catch (error) {
		console.log("Error in updateReturnStatus controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getTicketMessages = async (req, res) => {
	try {
		const { ticketId } = req.params;
		const messages = await Message.find({ ticket: ticketId }).populate("sender", "name role").sort({ createdAt: 1 });
		res.json(messages);
	} catch (error) {
		console.log("Error in getTicketMessages controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const replyToTicket = async (req, res) => {
	try {
		const { ticketId } = req.params;
		const { content } = req.body;

		const message = await Message.create({
			ticket: ticketId,
			sender: req.user._id,
			content,
			isAdmin: req.user.role === "admin" || req.user.role === "support",
		});

		// Update ticket status to In Progress if it's currently Open
		await Ticket.findByIdAndUpdate(ticketId, {
			$set: { status: "In Progress" },
		});

		res.status(201).json(message);
	} catch (error) {
		console.log("Error in replyToTicket controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createTicket = async (req, res) => {
	try {
		const { subject, description, priority, orderId } = req.body;
		const ticket = await Ticket.create({
			user: req.user._id,
			subject,
			description,
			priority: priority || "Low",
			order: orderId || null,
		});
		res.status(201).json(ticket);
	} catch (error) {
		console.log("Error in createTicket controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getMyTickets = async (req, res) => {
	try {
		const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
		res.json(tickets);
	} catch (error) {
		console.log("Error in getMyTickets controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createReturnRequest = async (req, res) => {
	try {
		const { orderId, reason, amount } = req.body;
		const returnReq = await ReturnRequest.create({
			order: orderId,
			user: req.user._id,
			reason,
			amount,
		});
		res.status(201).json(returnReq);
	} catch (error) {
		console.log("Error in createReturnRequest controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getMyReturns = async (req, res) => {
	try {
		const returns = await ReturnRequest.find({ user: req.user._id }).populate("order").sort({ createdAt: -1 });
		res.json(returns);
	} catch (error) {
		console.log("Error in getMyReturns controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const { search } = req.query;
		let query = {};
		if (search) {
			query = {
				$or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
			};
		}
		const users = await User.find(query).select("-password").sort({ createdAt: -1 });
		res.json(users);
	} catch (error) {
		console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		const user = await User.findById(id);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Protect admins
		if (user.role === "admin" && req.user.role !== "admin") {
			return res.status(403).json({ message: "You cannot change an admin's role" });
		}

		user.role = role;
		await user.save();

		res.json({ message: "Role updated successfully", user: { _id: user._id, name: user.name, role: user.role } });
	} catch (error) {
		console.log("Error in updateUserRole controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!user) return res.status(404).json({ message: "User not found" });

		// Protect admins
		if (user.role === "admin" && req.user.role !== "admin") {
			return res.status(403).json({ message: "You cannot delete an admin" });
		}

		await User.findByIdAndDelete(id);
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.log("Error in deleteUser controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
