import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, RefreshCcw, MessageSquare, UserCheck } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";

import TicketList from "../components/TicketList";
import ReturnManagement from "../components/ReturnManagement";
import UsersList from "../components/UsersList";

const tabs = [
	{ id: "help-desk", label: "Help Desk", icon: Ticket },
	{ id: "returns", label: "Returns & Refunds", icon: RefreshCcw },
	{ id: "users", label: "User Accounts", icon: UserCheck },
];

const SupportPage = () => {
	const [activeTab, setActiveTab] = useState("help-desk");
	const { fetchTickets, fetchReturns, fetchUsers } = useSupportStore();

	useEffect(() => {
		fetchTickets();
		fetchReturns();
		fetchUsers();
	}, [fetchTickets, fetchReturns, fetchUsers]);

	return (
		<div className='min-h-screen relative overflow-hidden bg-gray-900 text-white'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-primary-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Staff Support Portal
				</motion.h1>

				<div className='flex justify-center mb-12'>
					<div className='flex flex-wrap items-center justify-center bg-gray-800 rounded-2xl p-1 shadow-2xl border border-gray-700 w-fit'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
									activeTab === tab.id ? "bg-primary-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
								}`}
							>
								<tab.icon size={18} />
								<span className='font-medium'>{tab.label}</span>
							</button>
						))}
					</div>
				</div>

				<motion.div
					key={activeTab}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.4 }}
				>
					{activeTab === "help-desk" && <TicketList />}
					{activeTab === "returns" && <ReturnManagement />}
					{activeTab === "users" && <UsersList />}
				</motion.div>
			</div>
		</div>
	);
};

export default SupportPage;
