import express from "express";
import { protectRoute, supportRoute } from "../middleware/auth.middleware.js";
import {
	getSupportMetrics,
	getAllTickets,
	updateTicketStatus,
	getAllReturns,
	updateReturnStatus,
	getTicketMessages,
	replyToTicket,
	createTicket,
	getMyTickets,
	createReturnRequest,
	getMyReturns,
	getAllUsers,
	updateUserRole,
	deleteUser,
} from "../controllers/support.controller.js";

const router = express.Router();

// Support Staff Routes
router.get("/metrics", protectRoute, supportRoute, getSupportMetrics);
router.get("/tickets", protectRoute, supportRoute, getAllTickets);
router.patch("/tickets/:id/status", protectRoute, supportRoute, updateTicketStatus);
router.get("/returns", protectRoute, supportRoute, getAllReturns);
router.patch("/returns/:id/status", protectRoute, supportRoute, updateReturnStatus);

// User Management (Support Staff Only)
router.get("/users", protectRoute, supportRoute, getAllUsers);
router.patch("/users/:id/role", protectRoute, supportRoute, updateUserRole);
router.delete("/users/:id", protectRoute, supportRoute, deleteUser);

// Common Routes (Both Staff and Customers)
router.get("/tickets/:ticketId/messages", protectRoute, getTicketMessages);
router.post("/tickets/:ticketId/reply", protectRoute, replyToTicket);

// Customer Routes
router.post("/tickets", protectRoute, createTicket);
router.get("/my-tickets", protectRoute, getMyTickets);
router.post("/returns", protectRoute, createReturnRequest);
router.get("/my-returns", protectRoute, getMyReturns);

export default router;
