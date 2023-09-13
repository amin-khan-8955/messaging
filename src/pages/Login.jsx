import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage, } from 'formik';
import * as Yup from 'yup';
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, getFirestore, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { firebaseApp } from '../config/firebase';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth';
import { toast } from 'react-hot-toast';


const Login = () => {
	const dispatch = useDispatch();

	const loginClickHandle = async (value) => {
		const loginWithAuth = async () => {
			try {

				//geting user from firebase auth
				const loginUser = await signInWithEmailAndPassword(
					getAuth(firebaseApp),
					value.email, value.password
				);

				// gatting data from firestore database
				const { docs } = await getDocs(
					query(
						collection(getFirestore(firebaseApp), "users"),
						where("email", "==", loginUser.user.email)
					)
				);

				//storing data in out app in auth slice
				dispatch(
					login(
						{ id: docs[0].id, ...docs[0].data() }
					)
				);
			} catch (error) {
				console.log("error", error)
				alert(error.message);
			}
		}
		toast.promise(loginWithAuth(), { loading: "Loading...", error: "Somthing Went Wrong", success: "Logged in successfully" })


	}

	const googleClickHandler = () => {
		const loginWithGoogle = async () => {
			try {
				//google auth methos=> getting data from google
				const result = await signInWithPopup(
					getAuth(firebaseApp),
					new GoogleAuthProvider()
				);

				//chaking user already exist in database or not
				const { docs } = await getDocs(
					query(
						collection(getFirestore(firebaseApp), "users"),
						where("email", "==", result.user.email)
					)
				);
				//if user account  exist in databse then login 
				if (docs?.length) {
					//login to our app
					dispatch(
						login(
							{ id: docs[0].id, ...docs[0].data() }
						)
					);

				} else {
					//if data not exist in databse then create account in database then aftern login 
					const newUser = await addDoc(
						collection(getFirestore(firebaseApp), "users",),
						{
							username: result.user.displayName,
							email: result.user.email,
							avatar: result.user.photoURL,
							uid: result.user.uid,
						}
					);
					////login to our app
					dispatch(
						login(
							{
								id: newUser.id,
								username: result.user.displayName,
								email: result.user.email,
								avatar: result.user.photoURL,
								uid: result.user.uid,
							}
						)
					);
				}
			} catch (error) {
				console.log("error", error)
			}
		}
		toast.promise(loginWithGoogle(), { loading: "Loading...", error: "Somthing Went Wrong", success: "Logged in successfully" })
	}

	const loginSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string().min(6, "Too Short!").required('Required'),
	});

	const ErrMassage = ({ name }) => <ErrorMessage name={name} render={msg =>
		<div className='text-red-500 text-sm'>{msg}</div>}
	/>

	console.log("current", getAuth(firebaseApp).currentUser)
	return (
		<div>
			<h1 className='text-center font-bold text-2xl pt-12'>
				Login
			</h1>
			<Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={loginClickHandle}>
				<Form action="" className='p-3 m-3'>
					<div className='p-2 mb-4'>
						<label className='' htmlFor="">Email</label>
						<div className='mt-3'>
							<Field type="text" className='w-full outline-none' name="email" placeholder='type your username' />
							<hr className='border-gray-500 mt-1 ' />
							<ErrMassage name="email" />
						</div>
					</div>
					<div className='p-2 mb-1'>
						<label className='' htmlFor="">password</label>
						<div className='mt-3'>
							<Field type="password" className=' w-full outline-none' name="password" placeholder='type your password' />
							<hr className='border-gray-500 mt-1 ' />
							<ErrMassage name="password" />
						</div>
					</div>
					<div className='text-end mb-1'>
						<Link to="/register" className='text-gray-500'>New Register here </Link>
					</div>
					<div className='text-end mb-4'>
						<Link to="#" className='text-gray-500'> forgot password</Link>
					</div>
					<div className='w-full text-center'>
						<button type='submit' className='bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500 w-[80%] py-1 rounded-full font-bold text-white'>
							Login
						</button>
					</div>
				</Form>
			</Formik>
			<div className='text-gray-500 text-center text-normal pb-5'>
				<button onClick={googleClickHandler} className='w-[60%] outline rounded-full mx-auto flex px-2 py-1 justify-center items-center'>
					<FcGoogle className='text-2xl m-1' />
					<p>Signin with Google</p>
				</button>
			</div>
		</div>
	)
}

export default Login