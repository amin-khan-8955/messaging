import React from 'react'
import { MdConnectWithoutContact } from "react-icons/md";
import { BsCheckLg } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { getFirestore, updateDoc, collection, serverTimestamp, getDocs, doc, addDoc, query, where, documentId, deleteDoc, and } from "firebase/firestore";
import { firebaseApp } from '../config/firebase';

const ConnectionList = ({ users = [], title = '', type = "" }) => {
    const { user: me } = useSelector(state => state.auth);

    const connectClickHandler = async (receiverId) => {
        console.log("receiverId", receiverId);
        try {
            await addDoc(
                collection(getFirestore(firebaseApp), "connections"),
                {
                    senderId: me.id,
                    receiverId: receiverId,
                }
            );
        } catch (error) {
            console.log(error)
        }
    }

    const cencelClickHandler = async (connectionId) => {
        await deleteDoc(
            doc(
                getFirestore(firebaseApp),
                "connections",
                connectionId
            )
        )
    };

    const acceptClickHandler = async (connectionId) => {
        console.log("connectionId", connectionId)

        await updateDoc(
            doc(
                getFirestore(firebaseApp),
                "connections",
                connectionId
            ),
            {
                isConnected: true
            }
        )
    }

    if (!users.length) {
        return <div></div>
    }
    return (
        <div className='mt-4 p-2 border-2 rounded-xl border-gray-300'>
            <div className='flex justify-between align-center'>
                <div className='my-auto p-2'>
                    <h2 className='font-bold'>{title}</h2>
                </div>
            </div>
            <ul className=''>
                {
                    users.map(user => (
                        <li key={user.id} className='flex justify-around align-center p-2 border-2 rounded-xl border-gray-300 m-1'>
                            <div className='w-[10%] flex justify-center'>

                                <img src={user.avatar ?? "user-default.png"} alt={user.firstname} />
                            </div>
                            <div className='w-[70%]'>
                                <h1 className='text-md font-bold'>
                                    {user.username}
                                </h1>
                                <span className='p- m-0 text-gray-500'>
                                    team magaer
                                </span>
                            </div>
                            <div className='w-[10%] flex justify-around items-end'>
                                {type === "request" ?
                                    <div className=''>
                                        <button onClick={() => acceptClickHandler(user.connectionId)} className='w-full'>
                                            <div className='border-2 bg-green-600 border-gray-600 font-bold tracking-wider text-white rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
                                                Accept <span> <BsCheckLg /></span>
                                            </div>
                                        </button>
                                        <button onClick={() => cencelClickHandler(user.connectionId)} className='w-full'>
                                            <div className=' border-2 bg-red-500 text-white border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
                                                Reject <span> <RxCross2 /></span>
                                            </div>
                                        </button>
                                    </div> :
                                    type === "sender" ? <button onClick={() => { cencelClickHandler(user.connectionId) }} className='w-full'>
                                        <div className=' border-2 bg-red-500 text-white border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
                                            Cancel <span> <RxCross2 /></span>
                                        </div>
                                    </button> :
                                        <button onClick={() => connectClickHandler(user.id)} className=''>
                                            <div className=' border-2 border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
                                                Connect <span> <MdConnectWithoutContact /></span>
                                            </div>
                                        </button>}
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ConnectionList