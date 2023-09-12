import React from 'react'
import { BiEdit } from "react-icons/bi";
import UserListTile from '../components/UserList';
import { direct, favorites, groups } from '../demoData';
import UserList from '../components/UserList';
import MessageBox from '../components/MessageBox';
import { useSelector } from 'react-redux';


const Message = () => {
	const { connectedUsers } = useSelector(state => state.connection);
    
    return (
        <section className='flex'>
            <div className='flex-1 p-4 font-bold bg-white w-72 h-[100vh] '>
                <div className=' h-[20vh]'>
                    <div className='flex flex-1 justify-between w-full text-2xl '>
                        <div><h1>Chat</h1></div>
                        <div><BiEdit /></div>
                    </div>
                    <div>
                        <input type="search" className='bg-zinc-200 rounded-[10px] font-normal w-full p-1 mt-3' placeholder='search' />
                    </div>
                </div>

                <div className='overflow-y-scroll h-[76vh]'>
                    <br />
                    <UserList title={"Favorites"} users={connectedUsers} />
                    <br />
                </div>
            </div>
            <div className='flex-2  bg-zinc-200 w-full'>
                <MessageBox />
            </div>

        </section>
    )
}

export default Message