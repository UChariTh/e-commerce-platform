import { useSupportStore } from "../stores/useSupportStore";
import { CheckCircle, XCircle, Clock, DollarSign, Package, AlertTriangle } from "lucide-react";

const ReturnManagement = () => {
	const { returns, updateReturnStatus, loading } = useSupportStore();

	const getStatusColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400";
			case "Approved":
				return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400";
			case "Rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading && returns.length === 0) {
		return <div className='text-center p-8 text-gray-400'>Loading return requests...</div>;
	}

	return (
		<div className='bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden'>
			<div className='p-6 border-b border-gray-700 bg-gray-800/50'>
				<h3 className='text-xl font-semibold text-white flex items-center gap-2'>
					<RefreshCcw className='text-primary-400' size={24} />
					Return & Refund Requests
				</h3>
				<p className='text-sm text-gray-400 mt-1'>Review and process customer refund demands</p>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full text-left'>
					<thead>
						<tr className='bg-gray-700/50 text-gray-400 text-xs uppercase tracking-widest font-semibold uppercase'>
							<th className='px-6 py-4'>Order ID / Customer</th>
							<th className='px-6 py-4'>Reason</th>
							<th className='px-6 py-4'>Amount</th>
							<th className='px-6 py-4'>Status</th>
							<th className='px-6 py-4 text-center'>Actions</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
						{returns.map((request) => (
							<tr key={request._id} className='hover:bg-gray-700/30 transition-colors'>
								<td className='px-6 py-4'>
									<div className='font-medium text-white flex items-center gap-2'>
										<Package size={14} className='text-gray-500' />
										{request.order?._id?.slice(-8) || "N/A"}
									</div>
									<div className='text-xs text-gray-500 mt-1'>{request.user.name}</div>
								</td>
								<td className='px-6 py-4'>
									<div className='text-sm text-gray-300 max-w-xs truncate' title={request.reason}>
										{request.reason}
									</div>
								</td>
								<td className='px-6 py-4 font-bold text-primary-400'>
									${request.amount.toFixed(2)}
								</td>
								<td className='px-6 py-4'>
									<span
										className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
											request.status
										)} border border-transparent`}
									>
										{request.status === "Pending" && <Clock size={12} />}
										{request.status === "Approved" && <CheckCircle size={12} />}
										{request.status === "Rejected" && <XCircle size={12} />}
										{request.status}
									</span>
								</td>
								<td className='px-6 py-4'>
									<div className='flex justify-center gap-3'>
										{request.status === "Pending" && (
											<>
												<button
													onClick={() => updateReturnStatus(request._id, "Approved")}
													className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/20 text-green-500 hover:bg-green-600/40 transition-all text-xs font-semibold'
												>
													<CheckCircle size={14} />
													Approve
												</button>
												<button
													onClick={() => updateReturnStatus(request._id, "Rejected")}
													className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600/40 transition-all text-xs font-semibold'
												>
													<XCircle size={14} />
													Reject
												</button>
											</>
										)}
										{request.status !== "Pending" && (
											<span className='text-xs text-gray-600 font-italic'>Processed</span>
										)}
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

import { RefreshCcw } from "lucide-react";
export default ReturnManagement;
