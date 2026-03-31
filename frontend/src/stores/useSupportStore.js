import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useSupportStore = create((set, get) => ({
	tickets: [],
	myTickets: [],
	returns: [],
	myReturns: [],
	users: [],
	metrics: null,
	loading: false,
	messages: [],

	fetchUsers: async (search = "") => {
		set({ loading: true });
		try {
			const res = await axios.get(`/support/users?search=${search}`);
			set({ users: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch users");
		}
	},

	updateUserRole: async (userId, role) => {
		try {
			const res = await axios.patch(`/support/users/${userId}/role`, { role });
			set((state) => ({
				users: state.users.map((u) => (u._id === userId ? { ...u, role: res.data.user.role } : u)),
			}));
			toast.success("User role updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update role");
		}
	},

	deleteUser: async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;
		try {
			await axios.delete(`/support/users/${userId}`);
			set((state) => ({
				users: state.users.filter((u) => u._id !== userId),
			}));
			toast.success("User deleted successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete user");
		}
	},

	fetchMetrics: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/support/metrics");
			set({ metrics: res.data, loading: false });
		} catch (error) {
			console.error("Error fetching support metrics:", error);
			set({ loading: false });
		}
	},

	fetchTickets: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/support/tickets");
			set({ tickets: res.data, loading: false });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch tickets");
			set({ loading: false });
		}
	},

	updateTicketStatus: async (ticketId, status) => {
		try {
			const res = await axios.patch(`/support/tickets/${ticketId}/status`, { status });
			set((state) => ({
				tickets: state.tickets.map((t) => (t._id === ticketId ? res.data : t)),
			}));
			toast.success("Ticket status updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update ticket status");
		}
	},

	fetchReturns: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/support/returns");
			set({ returns: res.data, loading: false });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch returns");
			set({ loading: false });
		}
	},

	updateReturnStatus: async (returnId, status) => {
		try {
			const res = await axios.patch(`/support/returns/${returnId}/status`, { status });
			set((state) => ({
				returns: state.returns.map((r) => (r._id === returnId ? res.data : r)),
			}));
			toast.success("Return status updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update return status");
		}
	},

	fetchMyTickets: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/support/my-tickets");
			set({ myTickets: res.data, loading: false });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch your tickets");
			set({ loading: false });
		}
	},

	createTicket: async (ticketData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/support/tickets", ticketData);
			set((state) => ({
				myTickets: [res.data, ...(state.myTickets || [])],
				loading: false,
			}));
			toast.success("Ticket created successfully");
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create ticket");
			set({ loading: false });
			return null;
		}
	},

	fetchMyReturns: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/support/my-returns");
			set({ myReturns: res.data, loading: false });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch your return requests");
			set({ loading: false });
		}
	},

	createReturnRequest: async (returnData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/support/returns", returnData);
			set((state) => ({
				myReturns: [res.data, ...(state.myReturns || [])],
				loading: false,
			}));
			toast.success("Return request submitted");
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to submit return request");
			set({ loading: false });
			return null;
		}
	},

	fetchTicketMessages: async (ticketId) => {
		try {
			const res = await axios.get(`/support/tickets/${ticketId}/messages`);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch messages");
		}
	},

	replyToTicket: async (ticketId, content) => {
		try {
			const res = await axios.post(`/support/tickets/${ticketId}/reply`, { content });
			set((state) => ({
				messages: [...state.messages, res.data],
			}));
			toast.success("Reply sent");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to send reply");
		}
	},
}));
