import React, { useEffect, useState } from 'react'
import { FaVideo } from "react-icons/fa";
import { BsInfoSquareFill } from "react-icons/bs";
import { PiMicrophoneBold } from "react-icons/pi";
import { ImAttachment } from "react-icons/im";
import { HiMiniFaceSmile } from "react-icons/hi2";
import { FiSend } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addDoc, and, collection, getDocs, getFirestore, or, orderBy, query, where, Timestamp, onSnapshot, getDoc, doc, runTransaction, updateDoc, limit, deleteDoc } from 'firebase/firestore';
import { firebaseApp } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { removeMessageCountToConnectedUsers } from '../store/connectionSlice';
import { setRecentMessages } from '../store/messageSlice';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageDropdown from './messageDropdown';
import ConfirmModel from './confirmModel';
import moment from 'moment/moment';


const MessageBox = () => {
    const dispatch = useDispatch();
    const [textMessge, setTextMessage] = useState("");
    const [emojiToggle, setEmojiToggle] = useState(false);
    const [isDeleted, setIsDelete] = useState(null);
    const [isEdit, setIsEdit] = useState(null);
    const { user: remoteUser } = useSelector(state => state.message);
    const { recentMessages: messageList } = useSelector(state => state.message);
    const { user: me } = useSelector(state => state.auth);
    // getting data intialy
    useEffect(() => {
        if (remoteUser) {
            (async () => {
                const getMessagesQuerySnapshot = await getDocs(
                    query(
                        collection(getFirestore(firebaseApp), "messages"),
                        or(
                            and(
                                where("to", "==", remoteUser.id), ///messages which sen by me to remote
                                where("from", "==", me.id)
                            ),
                            and(
                                where("to", "==", me.id),   ///messages which sen by remote to me 
                                where("from", "==", remoteUser.id)
                            ),
                        ),
                        orderBy("createdAt", "desc"),
                        limit(10)
                    ))
                const messageMap = getMessagesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

                ///updating to seen true

                const unSeenMessagePromises = messageMap.filter(message => !message.seen).map(message => {
                    return updateDoc(doc(getFirestore(firebaseApp), "messages", message.id), { seen: true })
                })
                console.log("unSeenMessagePromises", unSeenMessagePromises);
                Promise.all(unSeenMessagePromises).then(d => {
                    console.log("dd", d)
                    dispatch(removeMessageCountToConnectedUsers(remoteUser.id))
                })

                dispatch(setRecentMessages(messageMap.reverse()));
            })();


        }
    }, [remoteUser]);

    useEffect(() => {
        return () => {
            localStorage.removeItem("messageUser");
        }
    }, [])

    //togetting data real time



    const sendClickHandler = async () => {
        if (!textMessge) {
            toast.error("Pleasen Enter a message");
            return;
        }
        if (isEdit) {
            const edit = async () => {
                await updateDoc(doc(getFirestore(firebaseApp), "messages", isEdit), { isEdit: true, message: textMessge });
            }
            toast.promise(
                edit(),
                {
                    success: "message updated successfully",
                    loading: "loadin...",
                    error: "something went wrong"
                });
            setIsEdit(null);
            setTextMessage("");

        } else {
            const send = (async () => {
                try {
                    await addDoc(
                        collection(getFirestore(firebaseApp), "messages"),
                        {
                            from: me.id,
                            to: remoteUser.id,
                            message: textMessge,
                            seen: false,
                            createdAt: Date.now()
                        }
                    );
                    setTextMessage("");
                } catch (error) {
                    console.log(error);
                }
            });
            toast.promise(
                send(),
                {
                    success: "message sent successfully",
                    loading: "loadin...",
                    error: "something went wrong"
                });
        }
    }

    const emojiSelectHandler = (e) => {
        console.log("emoji secleted", e);
        setTextMessage(textMessge + e.native);

    }

    const deleteClickHandler = async (id) => {

        const deleteMessage = (async () => {
            try {
                await deleteDoc(
                    doc(
                        getFirestore(firebaseApp),
                        "messages",
                        id
                    )
                )
                setIsDelete(null);
            } catch (error) {
                console.log(error);
            }
        });
        toast.promise(
            deleteMessage(),
            {
                success: "Message Deleted successfully",
                loading: "loadin...",
                error: "something went wrong"
            });

    }
    const editClickHandler = async (id, message) => {
        setTextMessage(message);
        setIsEdit(id);
    }



    if (!remoteUser) {
        return <> <div className='p-5 h-full'>
            <div className='outline-2 outline outline-gray-300 bg-gray-200 h-full w-full rounded items-center flex justify-center'>
                <p className='text-2xl'>
                    Select a user to send message
                </p>
            </div>
        </div> </>
    }

    return (
        <div className='h-full'>
            <div className='flex justify-around align-center p-1 pt-2'>
                <div className=' flex justify-center h-14 w-14 rounded-full outline outline-2 outline-white border-2 border-red-400'>
                    <img src={remoteUser.avatar ?? "user-default.png"} alt={remoteUser.username} className='rounded-full' />
                </div>
                <div className='w-[70%]'>
                    <h1 className='text-2xl font-bold'>
                        {remoteUser.username}
                    </h1>
                    <span className='p- m-0 text-green-500'>
                        online
                    </span>
                </div>
                <div className='w-[10%] flex justify-around'>
                    <button>
                        <FaVideo />
                    </button>
                    <button>
                        <BsInfoSquareFill />
                    </button>
                </div>
            </div>
            <hr className='bg-gray-400 h-1 overflow-y-auto' />
            {isDeleted ? <ConfirmModel
                message={"Are You Sure want to delete this message!"}
                onCancelClick={() => setIsDelete(null)}
                onConfirmClick={() => deleteClickHandler(isDeleted)}
            /> : null}
            <div className='p-5 min-h-[78vh] max-h-[78vh] h-auto mx-1 overflow-y-auto ' >
                {
                    messageList.map(doc => {
                        const isMe = doc.from == me.id;
                        return (
                            <div className='flex gap-1 my-4 relative' key={doc.id} dir={isMe ? "rtl" : "ltr"}>

                                {
                                    isMe ? <MessageDropdown
                                        onDeleteClick={() => setIsDelete(doc.id)}
                                        onEditClick={() => editClickHandler(doc.id, doc.message)} /> :
                                        null
                                }
                                <div className='w-12 h-12 flex justify-center h-8 w-8 rounded-full outline outline-2 outline-white'>
                                    <img src={(isMe ? me.avatar : remoteUser.avatar) ?? "user-default.png"} className='rounded-full z-0' alt="prfile" />
                                </div>

                                <div>
                                    <ul className='' dir={isMe ? "rtl" : "ltr"}>
                                        <li className='mb-[7px]'>
                                            <span className={`${isMe ? "bg-white text-black " : "bg-red-400 text-white"}  p-1 rounded-tl-lg rounded-e-lg mb-[5px]`}> {doc.message}</span>
                                        </li>

                                        <li className='p-0 m-0 flex gap-2 tracking-wide'>
                                            {isMe ? <span className=' font-bold'><FaCheck className={doc.seen ? "text-green-400" : 'text-slate-400'} /></span> : null}
                                            <span className="text-zinc-600 text-[11px] tracking-wide font-bold  p-0 m-0" > {moment(doc.createdAt).calendar()}  {doc.isEdit ? "edited" : ''} </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                }
            </div >
            <div className='flex justify-start align-center mx-4 gap-5 relative' >
                <div className='w-12 bg-white rounded-lg h-12  p-4'>
                    <button onClick={() => setEmojiToggle(!emojiToggle)}>  <HiMiniFaceSmile /> </button>
                    {
                        emojiToggle ? <div className='absolute bottom-12 -left-0'>
                            <Picker data={data} onEmojiSelect={emojiSelectHandler} />
                        </div> : null
                    }

                </div>
                <div className='w-full rounded-lg h-12 bg-white flex justify-between  p-4'>
                    <div className='flex gap-3 align-center justify-start w-full'>
                        <button><ImAttachment className='' /></button>

                        <input className='outline-none p-0 w-full px-5' value={textMessge} type='text' placeholder='Type a message' onChange={(e) => setTextMessage(e.target.value)} />
                    </div>
                    <div className='flex justify-between'>
                        <button onClick={sendClickHandler}>
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default MessageBox;