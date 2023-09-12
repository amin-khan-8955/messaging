import React, { useState } from 'react'
import UserList from '../components/UserList';
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import ConnectionList from '../components/ConnectionList';



const Connection = () => {
	const { user: me } = useSelector(state => state.auth);
	 
	//  this datta is coming from redux

	const { connectedUsers, requstedUsers, pandingUsers, allUsers } = useSelector(state => state.connection);

	const searchHandler = (e) => {
		setSearchInput(e.target.value.toLowerCase());
	}

	const userList = allUsers.filter(user => {
		if (!searchInput) {
			return true;
		}
		return user.username
			? user.username.toLowerCase().startsWith(searchInput)
			: false
	});

	console.log("users", allUsers);
	console.log("receivers", requstedUsers);
	console.log("senders", pandingUsers);
	console.log("connected", connectedUsers);
	console.log("me", me)


	return (
		<section className='flex h-full'>
			<div className='flex-1 p-4 font-bold bg-white w-72 h-full'>
				<div className=' h-[20vh]'>
					<div className='flex flex-1 justify-between w-full text-2xl '>
						<div><h1>Connections </h1></div>
						<div><BiEdit /></div>
					</div>
					<div>
						<input type="search" className='bg-zinc-200 rounded-[10px] font-normal w-full p-1 mt-3' placeholder='search connections' />
					</div>
				</div>
				<div className=' overflow-y-auto h-[76vh]'>
					<br />
					<UserList title={"My Connetions"} users={connectedUsers} />
				</div>
			</div>
			<div className='flex-2 h-full bg-zinc-200 w-full'>
				<div className='p-4'>
					<h1 className='p-1 text-xl font-bold mb-3'>
						Search Connections
					</h1>
					<div className=''>
						<div>
							<input type="search" onChange={searchHandler} className='bg-zinc-200 rounded-[10px] font-normal w-full p-2 px-4  mt-3 outline'
								placeholder='Search new Connections' />
						</div>
					</div>
				</div>
				<div className='overflow-y-auto p-2 h-[78vh] border-2 rounded-xl border-gray-300 m-2 p-3'>
					<ConnectionList users={pandingUsers} title="New Panding" type="sender" />
					<ConnectionList users={requstedUsers} title="New Request" type="request" />
					<ConnectionList users={userList} title="New Connctions" />
				</div>
			</div>
		</section >
	)
}

export default Connection