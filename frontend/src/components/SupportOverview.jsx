import { motion } from "framer-motion";
import { Ticket, Clock, CheckCircle, RefreshCcw } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";

const SupportOverview = () => {
	const { metrics, loading } = useSupportStore();

	if (loading || !metrics) {
		return <div className='text-center text-gray-400'>Loading metrics...</div>;
	}

	const stats = [
		{ label: "Total Tickets", value: metrics.totalTickets, icon: Ticket, color: "text-blue-400" },
		{ label: "Pending Issues", value: metrics.pendingIssues, icon: Clock, color: "text-yellow-400" },
		{ label: "Resolved Cases", value: metrics.resolvedCases, icon: CheckCircle, color: "text-green-400" },
		{ label: "Pending Returns", value: metrics.pendingReturns, icon: RefreshCcw, color: "text-red-400" },
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					className='bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl hover:border-primary-500 transition-colors duration-300'
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
				>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-gray-400 text-sm font-medium'>{stat.label}</p>
							<h3 className='text-3xl font-bold mt-2 text-white'>{stat.value}</h3>
						</div>
						<div className={`p-3 rounded-full bg-gray-900 ${stat.color} shadow-inner`}>
							<stat.icon size={24} />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default SupportOverview;
