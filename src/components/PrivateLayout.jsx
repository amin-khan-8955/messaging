import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from './Sidebar';
import { getFirestore, collection, getDocs, addDoc, query, where, documentId, or, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { addMessageCountToConnectedUsers, addToConnectedUsers, addToPandingUsers, addToRequestedUsers, removeToPandingUsers, removeToRequestUsers, setAllUsers, setConnectUsers, setPandingUsers, setRequestedUsers } from '../store/connectionSlice';
import { toast } from 'react-hot-toast';
import { firebaseApp } from '../config/firebase';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRecentMessages, deleteRecentMessage, editRecentMessage, seenRecentMessage } from '../store/messageSlice';


const PrivateLayout = () => {
	const dispatch = useDispatch();
	const { user: me } = useSelector(state => state.auth);
	const { connectedUsers, requstedUsers } = useSelector(state => state.connection);
	const { user: remoteUser } = useSelector(state => state.message);
	const { recentMessages } = useSelector(state => state.message);



	// alies name user to me 
	useEffect(() => {
		//geting connection data from firestore
		const getConnections = async () => {
			const receverData = [];
			const senderData = [];
			const connectdData = [];
			const connectionMap = {};

			const requestQuerySnapshot = await getDocs(
				query(
					collection(getFirestore(firebaseApp), "connections"),
					or(
						where("receiverId", "==", me.id),
						where("senderId", "==", me.id)
					)
				)
			);

			//array of remote user id if is in sernder then from sender or lese from receiver 
			const remoteIds = requestQuerySnapshot.docs?.map(doc => {
				const d = doc.data();
				//checking whether my id is in sender orn receiver
				const isSender = d.senderId === me.id;
				// getting remotUser id;
				const userId = isSender ? d.receiverId : d.senderId;
				//object m data userId key = userConnectoninformation ko staore kr rhe h
				connectionMap[userId] = {
					connectionId: doc.id,
					userId: userId,
					isSender: isSender,
					isConnected: !!d.isConnected
				};
				return userId;
			});

			if (remoteIds.length) {
				// getting data from user collection with remote ids
				const querySnapshot = await getDocs(
					query(
						collection(getFirestore(firebaseApp), "users"),
						where(documentId(), "in", remoteIds)
					)
				);
				// user ko data ko settign in  receiver and sender or its connected 
				querySnapshot.forEach((doc) => {
					if (connectionMap[doc.id].isConnected) {
						connectdData.push({ id: doc.id, ...doc.data(), connectionId: connectionMap[doc.id].connectionId });

					} else if (connectionMap[doc.id].isSender) {
						senderData.push({ id: doc.id, ...doc.data(), connectionId: connectionMap[doc.id].connectionId });

					} else {
						receverData.push({ id: doc.id, ...doc.data(), connectionId: connectionMap[doc.id].connectionId });
					}
				});
			}

			////getting neww user list without connection list
			const newUserQuery = await getDocs(
				query(
					collection(getFirestore(firebaseApp), "users"),
					where(documentId(), "not-in", [me.id, ...remoteIds])
				)
			);
			const newUser = newUserQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			dispatch(setRequestedUsers(receverData));
			dispatch(setPandingUsers(senderData));
			dispatch(setConnectUsers(connectdData));
			dispatch(setAllUsers(newUser));
		}

		getConnections();

	}, []);

	useEffect(() => {
		//getting realtime data from database subcription base it nyone insert, upadete or remove from connection collection
		const q = query(
			collection(getFirestore(firebaseApp), "connections"),
			or(
				where("receiverId", "==", me.id),
				where("senderId", "==", me.id)
			)
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			snapshot.docChanges().forEach(async (change) => {
				if (change.type === "added") {
					const { receiverId, senderId } = change.doc.data();
					if (receiverId == me.id) {
						const isUserExist = requstedUsers.find((user) => user.id === senderId);
						if (!isUserExist) {
							const user = await userById(senderId);
							toast(`You got a friend request from "${user.data().username}"`);
							dispatch(addToRequestedUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}
					} else {
						const isUserExist = requstedUsers.find((user) => user.id === receiverId);
						if (!isUserExist) {
							const user = await userById(receiverId);
							toast(`Request has been send to "${user.data().username}"`);
							dispatch(addToPandingUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}
					}
				}
				if (change.type === "modified") {
					const { receiverId, senderId } = change.doc.data();
					if (receiverId == me.id) {
						const isUserExist = connectedUsers.find((user) => user.id === senderId);
						if (!isUserExist) {
							const user = await userById(senderId);
							toast(`you have accepted "${user.data().username}" request`);
							dispatch(addToConnectedUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}

					} else {
						const isUserExist = connectedUsers.find((user) => user.id === receiverId);
						if (!isUserExist) {
							const user = await userById(receiverId);
							toast(`"${user.data().username}" request has Rejected`);
							dispatch(addToConnectedUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}
					}
				}
				if (change.type === "removed") {
					console.log("Removed city: ", change.doc.data());
					const { receiverId, senderId } = change.doc.data();
					if (receiverId == me.id) {
						const isUserExist = connectedUsers.find((user) => user.id === senderId);
						if (!isUserExist) {
							const user = await userById(senderId);
							toast(`"${user.data().username}"'s Friend has Rejected`);
							dispatch(removeToRequestUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}

					} else {
						const isUserExist = connectedUsers.find((user) => user.id === receiverId);
						if (!isUserExist) {
							toast("Your friend request has Accepted");
							toast(`"${user.data().username}"'s Friend has Cenceled`);
							const user = await userById(receiverId);
							dispatch(removeToPandingUsers({
								id: user.id, ...user.data(), connectionId: change.doc.id
							}));
						}
					}
				}
			});
		});
		return unsubscribe;
	}, []);


	console.log("remoteUser", remoteUser);


	useEffect(() => {
		const userById = async (userId) => await getDoc(doc(getFirestore(firebaseApp), "users", userId));

		//getting realtime data from database subcription base it nyone insert, upadete or remove from connection collection
		const q = query(
			collection(getFirestore(firebaseApp), "messages"),
			or(

				///messages which send by me 
				where("from", "==", me.id),

				///messages which received me
				where("to", "==", me.id)

			),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			snapshot.docChanges().forEach(async (change) => {
				const { from, to, seen, isEdit } = change.doc.data();
				const remoteUser = localStorage.getItem("messageUser") && JSON.parse(localStorage.getItem("messageUser"));
				if (change.type === "added") {
					if (me.id == to) { //receiver
						if (remoteUser && remoteUser.id == from) {
							updateDoc(doc(getFirestore(firebaseApp), "messages", change.doc.id), { seen: true });
							dispatch(addRecentMessages({ id: change.doc.id, ...change.doc.data() }));
						} else {
							dispatch(addMessageCountToConnectedUsers(from));
						}
					} else { //sender
						dispatch(addRecentMessages({ id: change.doc.id, ...change.doc.data() }));
					}
				}
				if (change.type === "modified") {
					if (remoteUser && remoteUser.id == from) {
						if (isEdit) {
							dispatch(editRecentMessage({ id: change.doc.id, ...change.doc.data() }));
						}
					}
					if (remoteUser && remoteUser.id == to) {
						dispatch(seenRecentMessage(change.doc.id));
					}
				}
				if (change.type === "removed") {
					dispatch(deleteRecentMessage(change.doc.id));
				}
			});
		});
		return unsubscribe;
	}, []);




	const userById = async (userId) => await getDoc(doc(getFirestore(firebaseApp), "users", userId));



	return (
		<main className='flex h-screen relative'>
			<Sidebar />
			<div className='w-full h-full relative'>
				{/* Outlet for nested routed which are difined in children route of this componet */}
				<Outlet />
			</div>

		</main>

	)
}

export default PrivateLayout