import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle, HelpCircle } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";

const NewTicketModal = ({ isOpen, onClose }) => {
	const [ticketData, setTicketData] = useState({
		subject: "",
		description: "",
		priority: "Medium",
	});
	const { createTicket, loading } = useSupportStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await createTicket(ticketData);
		if (success) {
			setTicketData({ subject: "", description: "", priority: "Medium" });
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className='bg-gray-800 w-full max-w-lg rounded-3xl border border-gray-700 shadow-2xl overflow-hidden'
					>
						<div className='p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/80'>
							<div className='flex items-center gap-3'>
								<div className='bg-primary-600/20 p-2 rounded-xl'>
									<HelpCircle className='text-primary-400' size={24} />
								</div>
								<h2 className='text-xl font-bold text-white'>How can we help?</h2>
							</div>
							<button onClick={onClose} className='text-gray-500 hover:text-white transition-colors bg-gray-700/50 p-1.5 rounded-lg'>
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className='p-8 space-y-6'>
							<div className='space-y-2'>
								<label className='text-sm font-medium text-gray-400 ml-1'>Quick Summary</label>
								<input
									type='text'
									required
									placeholder='e.g. Broken charger issue'
									className='w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-all shadow-inner'
									value={ticketData.subject}
									onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
								/>
							</div>

							<div className='space-y-2'>
								<label className='text-sm font-medium text-gray-400 ml-1'>Tell us more</label>
								<textarea
									required
									rows='4'
									placeholder='Please provide details about your problem...'
									className='w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-all shadow-inner resize-none'
									value={ticketData.description}
									onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
								/>
							</div>

							<div className='grid grid-cols-3 gap-3'>
								{["Low", "Medium", "High"].map((p) => (
									<button
										key={p}
										type='button'
										onClick={() => setTicketData({ ...ticketData, priority: p })}
										className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
											ticketData.priority === p
												? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/40"
												: "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500"
										}`}
									>
										{p}
									</button>
								))}
							</div>

							<div className='pt-4'>
								<button
									type='submit'
									disabled={loading}
									className='w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center justify-center gap-2 group active:scale-[0.98]'
								>
									{loading ? "Submitting..." : (
										<>
											Submit Ticket
											<Send size={18} className='transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
										</>
									)}
								</button>
							</div>

							<p className='text-center text-[10px] text-gray-500 mt-4 leading-relaxed'>
								Our support team usually responds within 24 hours. <br />
								Urgent tickets are prioritized.
							</p>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default NewTicketModal;
