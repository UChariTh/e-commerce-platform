import { useState, useEffect } from "react";
import { useSupportStore } from "../stores/useSupportStore";
import { Send, User, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CommunicationPanel = () => {
	const { tickets, messages, fetchTicketMessages, replyToTicket, loading } = useSupportStore();
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [replyContent, setReplyContent] = useState("");

	useEffect(() => {
		if (selectedTicket) {
			fetchTicketMessages(selectedTicket._id);
		}
	}, [selectedTicket, fetchTicketMessages]);

	const handleReply = async (e) => {
		e.preventDefault();
		if (!replyContent.trim()) return;
		await replyToTicket(selectedTicket._id, replyContent);
		setReplyContent("");
	};

	return (
		<div className='flex flex-col lg:flex-row h-[700px] gap-6'>
			{/* Left Sidebar: Ticket List */}
			<div className='w-full lg:w-96 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden'>
				<div className='p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2'>
					<MessageCircle className='text-primary-400' size={20} />
					<h3 className='font-semibold text-white'>Conversation History</h3>
				</div>
				<div className='flex-1 overflow-y-auto divide-y divide-gray-700'>
					{tickets.map((ticket) => (
						<button
							key={ticket._id}
							onClick={() => setSelectedTicket(ticket)}
							className={`w-full p-4 text-left hover:bg-gray-700/50 transition-all ${
								selectedTicket?._id === ticket._id ? "bg-gray-700 border-l-4 border-primary-500 shadow-inner" : ""
							}`}
						>
							<div className='flex justify-between items-start mb-1'>
								<span className='font-medium text-white truncate max-w-[200px]'>{ticket.subject}</span>
								{ticket.status === "Resolved" ? (
									<CheckCircle size={14} className='text-green-500 shrink-0' />
								) : (
									<Clock size={14} className='text-yellow-500 shrink-0' />
								)}
							</div>
							<div className='text-xs text-gray-400 truncate'>{ticket.user.name}</div>
							<div className='text-[10px] text-gray-500 mt-2 flex justify-between items-center'>
								<span>{new Date(ticket.updatedAt).toLocaleTimeString()}</span>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Right Section: Chat Interface */}
			<div className='flex-1 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden'>
				{selectedTicket ? (
					<>
						<div className='p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center'>
							<div className='flex items-center gap-3'>
								<div className='bg-primary-600 p-2 rounded-full shadow-lg'>
									<User size={20} className='text-white' />
								</div>
								<div>
									<h4 className='text-white font-semibold text-sm'>{selectedTicket.subject}</h4>
									<p className='text-xs text-gray-400'>Client: {selectedTicket.user.name}</p>
								</div>
							</div>
						</div>

						<div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900/10 custom-scrollbar'>
							{messages.map((msg, index) => (
								<motion.div
									key={msg._id || index}
									initial={{ opacity: 0, scale: 0.95, y: 10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[80%] p-4 rounded-2xl shadow-xl ${
											msg.isAdmin
												? "bg-primary-600 text-white rounded-tr-none border border-primary-500"
												: "bg-gray-700 text-gray-200 rounded-tl-none border border-gray-600"
										}`}
									>
										<p className='text-sm leading-relaxed'>{msg.content}</p>
										<span className={`text-[10px] block mt-2 opacity-60 text-right`}>
											{new Date(msg.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
								</motion.div>
							))}
						</div>

						<form
							onSubmit={handleReply}
							className='p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-4 bg-gray-800/80'
						>
							<input
								type='text'
								value={replyContent}
								onChange={(e) => setReplyContent(e.target.value)}
								placeholder='Write your message here...'
								className='flex-1 bg-gray-900 border border-gray-700 rounded-xl py-3 px-5 text-gray-300 focus:outline-none focus:border-primary-500 transition-all shadow-inner'
							/>
							<button
								type='submit'
								disabled={!replyContent.trim() || loading}
								className='p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-lg shadow-primary-900/20'
							>
								<Send size={20} />
							</button>
						</form>
					</>
				) : (
					<div className='flex-1 flex flex-col items-center justify-center p-8 space-y-4'>
						<div className='p-6 bg-gray-700/50 rounded-full border border-gray-600 shadow-xl'>
							<MessageCircle size={48} className='text-gray-500 animate-pulse' />
						</div>
						<h3 className='text-xl font-semibold text-gray-300'>Select a Ticket</h3>
						<p className='text-gray-500 text-center max-w-xs'>
							Choose a conversation from the list to start communicating with the customer.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommunicationPanel;
