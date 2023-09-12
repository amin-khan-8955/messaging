import React from 'react'
import { Link } from 'react-router-dom'
// import { GoPerson } from 'react-icons/go';
import { GoPerson } from "react-icons/go";
import { BiMessageRounded } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import {  useSelector } from 'react-redux/es/hooks/useSelector';

const Sidebar = () => {

    const {user}= useSelector(state=>state.auth)
    return (
        <aside className='fixed flex flex-col bg-zinc-900 p-4 h-screen relative items-center justify-center' >
             <Link to="/setting">
                <div className='hover:bg-red-500 rounded-full border-white bg-blue-400 p-1 outline-red-200 my-4 w-12 h-12'>
                    <img src={user.avatar ?? "user-default.png"} alt={user.username } className=' rounded-full' />
                </div>
            </Link>

            <Link to="/">
                <div className='hover:bg-red-500 hover:rounded-[10px] p-2 my-4'>
                    <GoPerson className='text-white text-2xl' />
                </div>
            </Link>
            <Link to="/message">
                <div className='hover:bg-red-500 hover:rounded-[10px] p-2 my-4'>
                    <BiMessageRounded className='text-white text-2xl' />
                </div>
            </Link>
            <Link to="#">
                <div className='hover:bg-red-500 hover:rounded-[10px] p-2 my-4'>
                    <BsCalendar3 className='text-white text-2xl' />
                </div>
            </Link>
            <Link to="/setting">
                <div className='hover:bg-red-500 hover:rounded-[10px] p-2 my-4'>
                    <FiSettings className='text-white text-2xl' />
                </div>
            </Link>
        </aside>
    )
}

export default Sidebar