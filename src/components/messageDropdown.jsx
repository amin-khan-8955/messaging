import React, { useState } from 'react'
import { IoIosArrowDropdown } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";


const MessageDropdown = ({ onDeleteClick, onEditClick }) => {
    const [isShow, setIsShow] = useState(false);
    return (
        <div className='relative'>
            <button onClick={() => setIsShow(!isShow)}><IoIosArrowDropdown className='text-xl text-gray-900' /></button>
            {
                isShow ? <ul className='bg-white p-2 rounded absolute z-10'>
                    <li dir='ltr'>
                        <button onClick={onEditClick} className='flex justify-around items-center p-1'>
                            <span className='mx-1'><BiSolidEdit /></span>    <span>Edit</span>
                        </button>
                    </li>
                    <li dir='ltr'>
                        <button onClick={onDeleteClick} className='flex justify-around items-center p-1'>
                            <span className='mx-1'> <RiDeleteBin6Line /> </span>  <span>Delete</span>
                        </button>
                    </li>
                </ul> : null
            }
        </div>
    )
}

export default MessageDropdown