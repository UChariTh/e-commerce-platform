import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, RefreshCcw, PlusCircle, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";
import NewTicketModal from "../components/NewTicketModal";

const CustomerDashboard = () => {
	const { myTickets, myReturns, fetchMyTickets, fetchMyReturns, fetchTicketMessages, messages, replyToTicket, loading } = useSupportStore();
	const [activeTab, setActiveTab] = useState("tickets");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [expandedTicketId, setExpandedTicketId] = useState(null);
	const [replyText, setReplyText] = useState("");

	useEffect(() => {
		fetchMyTickets();
		fetchMyReturns();
	}, [fetchMyTickets, fetchMyReturns]);

	const toggleTicket = (ticketId) => {
		if (expandedTicketId === ticketId) {
			setExpandedTicketId(null);
		} else {
			setExpandedTicketId(ticketId);
			fetchTicketMessages(ticketId);
		}
	};

	const handleReply = async (e, ticketId) => {
		e.preventDefault();
		if (!replyText.trim()) return;
		await replyToTicket(ticketId, replyText);
		setReplyText("");
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "Open": return <AlertCircle size={18} className='text-red-400' />;
			case "In Progress": return <Clock size={18} className='text-yellow-400' />;
			case "Resolved": return <CheckCircle size={18} className='text-green-400' />;
			default: return null;
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white pb-12'>
			<div className='max-w-4xl mx-auto px-4 pt-8'>
				<div className='flex justify-between items-center mb-10'>
					<motion.h1 
						className='text-3xl font-bold text-primary-400'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
					>
						Help Desk & Returns
					</motion.h1>
					<motion.button
						onClick={() => setIsModalOpen(true)}
						className='flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-900/20 active:scale-95'
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.05 }}
					>
						<PlusCircle size={20} />
						New Ticket
					</motion.button>
				</div>

				{/* Tabs */}
				<div className='flex gap-4 mb-8 bg-gray-800/50 p-1.5 rounded-2xl w-fit border border-gray-700'>
					<button
						onClick={() => setActiveTab("tickets")}
						className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
							activeTab === "tickets" ? "bg-primary-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
						}`}
					>
						<Ticket size={18} />
						Help Desk
					</button>
					<button
						onClick={() => setActiveTab("returns")}
						className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
							activeTab === "returns" ? "bg-primary-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
						}`}
					>
						<RefreshCcw size={18} />
						Returns & Refunds
					</button>
				</div>

				{/* Content */}
				<AnimatePresence mode='wait'>
					{activeTab === "tickets" ? (
						<motion.div
							key='tickets'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className='space-y-4'
						>
							{myTickets?.length > 0 ? (
								myTickets.map((ticket) => (
									<div 
										key={ticket._id} 
										className='bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden transition-all hover:border-gray-600'
									>
										<button 
											onClick={() => toggleTicket(ticket._id)}
											className='w-full p-5 flex items-center justify-between text-left hover:bg-gray-700/30'
										>
											<div className='flex items-center gap-4'>
												{getStatusIcon(ticket.status)}
												<div>
													<h3 className='font-semibold text-white'>{ticket.subject}</h3>
													<p className='text-xs text-gray-500 mt-0.5'>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
												</div>
											</div>
											<div className='flex items-center gap-4'>
												<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
													ticket.priority === "Urgent" ? "bg-red-500/20 text-red-400" :
													ticket.priority === "High" ? "bg-orange-500/20 text-orange-400" :
													"bg-gray-700 text-gray-400"
												}`}>
													{ticket.priority}
												</span>
												{expandedTicketId === ticket._id ? <ChevronUp size={20} className='text-gray-500' /> : <ChevronDown size={20} className='text-gray-500' />}
											</div>
										</button>

										<AnimatePresence>
											{expandedTicketId === ticket._id && (
												<motion.div
													initial={{ height: 0 }}
													animate={{ height: "auto" }}
													exit={{ height: 0 }}
													className='overflow-hidden'
												>
													<div className='p-6 pt-0 border-t border-gray-700/50 bg-gray-900/20'>
														<div className='mb-6 p-4 bg-gray-800/40 rounded-xl text-sm text-gray-300 leading-relaxed italic'>
															"{ticket.description}"
														</div>
														
														<div className='space-y-4 mb-6'>
															{messages.map((msg) => (
																<div key={msg._id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
																	<div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${
																		msg.isAdmin ? "bg-gray-700 text-gray-200 rounded-tl-none" : "bg-primary-600 text-white rounded-tr-none shadow-md"
																	}`}>
																		{msg.content}
																		<span className='block text-[10px] opacity-60 mt-1.5 text-right'>
																			{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
																		</span>
																	</div>
																</div>
															))}
														</div>

														<form onSubmit={(e) => handleReply(e, ticket._id)} className='flex gap-3'>
															<input 
																type="text" 
																value={replyText}
																onChange={(e) => setReplyText(e.target.value)}
																placeholder='Wait for a response or add more info...'
																className='flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500'
															/>
															<button 
																type="submit"
																disabled={!replyText.trim() || loading}
																className='bg-primary-600 hover:bg-primary-500 text-white p-2.5 rounded-xl disabled:opacity-50 transition-colors'
															>
																<MessageSquare size={18} />
															</button>
														</form>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								))
							) : (
								<div className='text-center py-20 bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-700'>
									<Ticket size={48} className='mx-auto text-gray-600 mb-4 opacity-50' />
									<h3 className='text-xl font-medium text-gray-400'>No active tickets</h3>
									<p className='text-gray-500 mt-2'>Have a question? We're here to help.</p>
								</div>
							)}
						</motion.div>
					) : (
						<motion.div
							key='returns'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className='bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden'
						>
							<div className='overflow-x-auto'>
								<table className='w-full text-left'>
									<thead className='bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
										<tr>
											<th className='px-6 py-4'>Order Reference</th>
											<th className='px-6 py-4'>Amount</th>
											<th className='px-6 py-4'>Processing</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-700'>
										{myReturns?.map((req) => (
											<tr key={req._id} className='hover:bg-gray-700/20 transition-colors'>
												<td className='px-6 py-4'>
													<div className='font-medium text-white'>Order #{req.order?._id?.slice(-6).toUpperCase()}</div>
													<div className='text-xs text-gray-500 mt-1 italic'>{req.reason}</div>
												</td>
												<td className='px-6 py-4 font-semibold text-primary-400'>${req.amount.toFixed(2)}</td>
												<td className='px-6 py-4'>
													<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
														req.status === "Approved" ? "bg-green-500/20 text-green-400" :
														req.status === "Rejected" ? "bg-red-500/20 text-red-400" :
														"bg-yellow-500/20 text-yellow-400"
													}`}>
														{req.status}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{!myReturns?.length && (
									<div className='p-12 text-center text-gray-500 italic'>
										No return requests yet.
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<NewTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	);
};

export default CustomerDashboard;
