import { useState } from "react";
import { useSupportStore } from "../stores/useSupportStore";
import { Search, Filter, MoreVertical, CheckCircle, Clock, AlertCircle } from "lucide-react";

const TicketList = () => {
	const { tickets, updateTicketStatus, loading } = useSupportStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("All");

	const filteredTickets = tickets.filter((ticket) => {
		const matchesSearch =
			ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterStatus === "All" || ticket.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "Open":
				return "text-red-400 bg-red-900/40";
			case "In Progress":
				return "text-yellow-400 bg-yellow-900/40";
			case "Resolved":
				return "text-green-400 bg-green-900/40";
			default:
				return "text-gray-400 bg-gray-900/40";
		}
	};

	return (
		<div className='bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden'>
			<div className='p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800/50'>
				<div className='relative w-full md:w-96'>
					<input
						type='text'
						placeholder='Search by customer or subject...'
						className='w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-gray-300 focus:outline-none focus:border-primary-500 transition-all shadow-inner'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search className='absolute left-3 top-3 text-gray-500' size={18} />
				</div>

				<div className='flex items-center gap-2'>
					<Filter className='text-gray-400' size={18} />
					<select
						className='bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-primary-500'
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<option value='All'>All Statuses</option>
						<option value='Open'>Open</option>
						<option value='In Progress'>In Progress</option>
						<option value='Resolved'>Resolved</option>
					</select>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full text-left border-collapse'>
					<thead>
						<tr className='bg-gray-700/50 text-gray-400 text-xs uppercase tracking-widest font-semibold uppercase'>
							<th className='px-6 py-4'>Subject / Customer</th>
							<th className='px-6 py-4'>Status</th>
							<th className='px-6 py-4'>Priority</th>
							<th className='px-6 py-4'>Created At</th>
							<th className='px-6 py-4'>Actions</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
						{filteredTickets.map((ticket) => (
							<tr key={ticket._id} className='hover:bg-gray-700/30 transition-colors'>
								<td className='px-6 py-4'>
									<div className='font-medium text-white'>{ticket.subject}</div>
									<div className='text-xs text-gray-500'>{ticket.user.name} ({ticket.user.email})</div>
								</td>
								<td className='px-6 py-4'>
									<span
										className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
											ticket.status
										)} border border-transparent flex items-center gap-1 w-fit`}
									>
										{ticket.status === "Open" && <AlertCircle size={14} />}
										{ticket.status === "In Progress" && <Clock size={14} />}
										{ticket.status === "Resolved" && <CheckCircle size={14} />}
										{ticket.status}
									</span>
								</td>
								<td className='px-6 py-4'>
									<span className={`px-2 py-1 rounded text-xs font-semibold ${
										ticket.priority === "Urgent" ? "bg-red-500/20 text-red-500" :
										ticket.priority === "High" ? "bg-orange-500/20 text-orange-500" :
										"bg-gray-700 text-gray-400"
									}`}>
										{ticket.priority}
									</span>
								</td>
								<td className='px-6 py-4 text-sm text-gray-400'>
									{new Date(ticket.createdAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4'>
									<div className='flex gap-2'>
										<button
											onClick={() => updateTicketStatus(ticket._id, "In Progress")}
											className='p-1.5 rounded-lg bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/40 transition-all'
											title='Mark In Progress'
										>
											<Clock size={16} />
										</button>
										<button
											onClick={() => updateTicketStatus(ticket._id, "Resolved")}
											className='p-1.5 rounded-lg bg-green-600/20 text-green-500 hover:bg-green-600/40 transition-all'
											title='Mark Resolved'
										>
											<CheckCircle size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TicketList;
