import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setMessageUser } from '../store/messageSlice';

const UserList = ({ title, users = [] }) => {
    const dispatch = useDispatch();
    
    const userClickHandler = (user) => {
        dispatch(setMessageUser(user));
    }
    
    return (
        <div>
            <h2 className='font-bold'>
                {title}
            </h2>
            {users?.map((user, i) =>
                <Link to="/message" key={i} onClick={(e) => userClickHandler(user)}>
                    <div  className='flex gap-2'>
                        <div className='flex justify-cente items-center rounded relative w-12'>
                            {
                                user.isOnline && <span className='bg-green-400 rounded-full h-3 w-3 text-[12px] text-white absolute top-1 right-0 border-white border-2'></span>
                            }
                            <img src={user.avatar ?? 'user-default.png'} alt={user.firstname} className='' />
                        </div>
                        <div>
                            <h4>
                                {user.username}
                            </h4>
                            <p className='text-[10px] w-44 flex justify-between text-zinc-400 font-normal'>
                                <span> {user.bio ?? "Available"} </span>
                                <span>{user.time}</span>
                            </p>
                            {(users.length - 1) !== i && <hr className='mt-3' />}
                        </div>
                        {
                            user.messageCount ?

                                <div className='flex justify-center items-center font-semibold m-auto'>
                                    <div className='bg-red-400 p-1 rounded-full h-5 w-5 text-[12px] text-white relative'>
                                        <span className='absolute bottom-0.5 left-1.5'>{user.messageCount}</span>
                                    </div>
                                </div> : null
                        }
                    </div>
                </Link>
            )}
        </div>
    )
}

export default UserList