import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, User as UserIcon, Trash2, Shield, UserCheck, ShieldCheck } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";
import { useUserStore } from "../stores/useUserStore";

const UsersList = () => {
	const { users, fetchUsers, updateUserRole, deleteUser, loading } = useSupportStore();
	const { user: currentUser } = useUserStore();
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchUsers(searchTerm);
	}, [fetchUsers, searchTerm]);

	const handleRoleChange = (userId, newRole) => {
		updateUserRole(userId, newRole);
	};

	const getRoleIcon = (role) => {
		switch (role) {
			case "admin": return <ShieldCheck className='text-red-400' size={18} />;
			case "support": return <Shield className='text-blue-400' size={18} />;
			default: return <UserIcon className='text-gray-400' size={18} />;
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className='bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden'
		>
			<div className='p-6 border-b border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<h2 className='text-2xl font-bold text-white flex items-center gap-2'>
					<UserCheck className='text-primary-400' />
					User Accounts
				</h2>
				<div className='relative w-full md:w-72'>
					<input
						type='text'
						placeholder='Search name or email...'
						className='w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search className='absolute left-3 top-3 text-gray-500' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full text-left'>
					<thead className='bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
						<tr>
							<th className='px-6 py-4'>User</th>
							<th className='px-6 py-4'>Role</th>
							<th className='px-6 py-4 text-right'>Actions</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
						{users?.map((user) => (
							<tr key={user._id} className='hover:bg-gray-700/20 transition-colors'>
								<td className='px-6 py-4'>
									<div className='flex items-center gap-3'>
										<div className='bg-gray-700 p-2 rounded-full'>
											<UserIcon className='text-gray-400' size={20} />
										</div>
										<div>
											<div className='font-medium text-white'>{user.name}</div>
											<div className='text-xs text-gray-500'>{user.email}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4'>
									<div className='flex items-center gap-2'>
										{getRoleIcon(user.role)}
										<select
											value={user.role}
											onChange={(e) => handleRoleChange(user._id, e.target.value)}
											disabled={user.role === "admin" && currentUser?.role !== "admin"}
											className='bg-gray-900 border border-gray-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500 outline-none text-white disabled:opacity-50'
										>
											<option value='customer'>Customer</option>
											<option value='support'>Support</option>
											<option value='admin'>Admin</option>
										</select>
									</div>
								</td>
								<td className='px-6 py-4 text-right'>
									<button
										onClick={() => deleteUser(user._id)}
										disabled={(user.role === "admin" && currentUser?.role !== "admin") || user._id === currentUser?._id}
										className='text-red-400 hover:text-red-300 transition-colors disabled:opacity-30 p-2 hover:bg-red-400/10 rounded-lg'
									>
										<Trash2 size={18} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{loading && users.length === 0 && (
					<div className='p-12 text-center text-gray-500 animate-pulse'>
						Loading users...
					</div>
				)}
				{!loading && users.length === 0 && (
					<div className='p-12 text-center text-gray-500 italic'>
						No users found matching your search.
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default UsersList;
