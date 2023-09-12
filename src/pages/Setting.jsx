import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateAuth } from '../store/auth';
import { Form, Field, Formik, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../config/firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from 'react-hot-toast';

const Setting = () => {
	const { user: me } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [image, setImage] = useState(me.avatar ?? "user-defaul.png");
	const [avataFile, setAvatarFile] = useState(null);


	const logoutClickHandler = () => {
		dispatch(logout());
	}

	const imgeOnChangeHandler = (e) => {
		console.log(e.target.files[0], "image");
		setAvatarFile(e.target.files[0]);
		//file to object link
		const imageLink = URL.createObjectURL(e.target.files[0]);
		setImage(imageLink);
	}
	const onSubmintHandler = async (value) => {
		const saveProfile = async () => {
			try {
				let avatarUrl = null;
				if (avataFile) {
					const avatarRef = ref(getStorage(firebaseApp), `avatars/${Date.now()}-${avataFile.name}`);
					await uploadBytes(
						avatarRef,
						avataFile
					);
					//get file url from firebase storage
					avatarUrl = await getDownloadURL(avatarRef);
				}

				const updatePayload = {
					username: value.username,
					email: value.email,
					phone: value.phone ?? null,
					bio: value.bio,
					avatar: avatarUrl ?? me.avatar
				};
				await updateDoc(doc(getFirestore(firebaseApp), "users", me.id), updatePayload);
				dispatch(updateAuth({ id: me.id, ...updatePayload }));
			} catch (error) {
				console.log("error", error);
			}
		}
		toast.promise(saveProfile(), {
			loading: "loading...",
			success: "Profile Updated successfully",
			error: "something went wrong"
		})

	}

	const settingSchema = Yup.object().shape({
		image: Yup.string(),
		username: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
		email: Yup.string().email('Invalid email').required('Required'),
		phone: Yup.string().min(10, "Too Short!").nullable(),
		bio: Yup.string().required('Required!')
	});

	const ErrMassage = ({ name }) => <ErrorMessage name={name} render={msg =>
		<div className='text-red-500 text-sm'>{msg}</div>}
	/>

	return (
		<section className='flex h-full m-0 p-0'>
			<div className='p-4 bg-white h-full w-72'>
				<div className=''>
					<div className='flex flex-1 justify-between w-full text-xl font-bold py-5'>
						<div><h1>Account Setting</h1></div>
						{/* <div><BiEdit /></div> */}
					</div>

				</div>

				<div className=''>
					<div>
						<ul className='tracking-wider mr-5'>
							<li className='px-2 py-3 cursor-pointer  text-gray-500 bg-red-200 rounded-[20px] font-bold text-blue-500 '> My Profile</li>
							<li className='px-2 py-3 cursor-pointer text-gray-500'> Sequerity</li>
							<li className='px-2 py-3 cursor-pointer text-gray-500'> Gernal</li>
							<li className='px-2 py-3 cursor-pointer text-gray-500'> My Profile</li>
							<li className='px-2 py-3 cursor-pointer text-gray-500'>
								<button className='px-3 py-2 cursor-pointer  text-gray-900 bg-red-200 rounded-[20px] font-bold text-blue-500' onClick={logoutClickHandler}>Logout</button>
							</li>
						</ul>
					</div>

				</div>
			</div>
			<div className='bg-zinc-200 h-full w-full p-4'>
				<div className=''>
					<h1 className='p-1 text-xl font-bold'>
						My Profile
					</h1>
					<Formik
						validationSchema={settingSchema}

						initialValues={{
							username: me.username,
							email: me.email,
							phone: me.phone,
							bio: me.bio ?? "Available",
							avatar: me.avatar
						}}
						onSubmit={onSubmintHandler}
					>
						<Form>
							<div className='flex justify-center align-center p-2  border-gray-300 '>
								<div className='h-44 w-44 border-4 border-gray-400 rounded-full flex items-center justify-center'>
									<div className='bg-red-400 rounded-full p-3'>
										<img src={image} alt="" className='w-36 h-36 rounded-full' />
									</div>
								</div>
								<div className='flex justify-around items-end'>

									<label className='' htmlFor='image'>
										<div className='border-2 border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
											Edit <span> <CiEdit /></span>
										</div>
									</label>
									<Field type="file" id="image" name="image" className='bg-zinc-200 hidden' onChange={imgeOnChangeHandler} />
									<ErrMassage name={"username"} />
								</div>
							</div>
							<div className='mt-5  p-2 border-2 rounded-xl border-gray-300'>
								<div className='flex justify-between align-center'>
									<div className='my-auto p-2'>
										<h2 className='font-bold'>Personal Information</h2>
									</div>
									<button className='p-2'>
										<div className='border-2 border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
											Edit <span> <CiEdit /></span>
										</div>
									</button>
								</div>

								<div className='flex flex-wrap'>
									<div className='p-2 w-full'>
										<label className='text-gray-500' htmlFor="">Username</label>
										<div className='mt-1'>
											<Field type="text" name="username" className='bg-zinc-200' />
										</div>
										<ErrMassage name={"username"} />
									</div>

									<div className='p-2 w-[100%]'>
										<label className='text-gray-500' htmlFor=""> Email</label>
										<div className='mt-1'>
											<Field type="text" name="email" className='bg-zinc-200' />
										</div>
										<ErrMassage name={"email"} />

									</div><div className='p-2 w-[50%]'>
										<label className='text-gray-500' htmlFor=""> Phone</label>
										<div className='mt-1'>
											<Field type="text" name="phone" className='bg-zinc-200' />
										</div>
										<ErrMassage name={"phone"} />

									</div><div className='p-2 w-[100%]'>
										<label className='text-gray-500' htmlFor="">Bio</label>
										<div className='mt-1'>
											<Field type="text" name="bio" className='bg-zinc-200 w-full' />
										</div>
										<ErrMassage name={"bio"} />

									</div>
								</div>
							</div>
							<div>
								<button type='submit'>
									<div className='border-2 bg-red-300 border-gray-600 rounded-full text-sm p-0.5 px-2 m-1 flex items-center gap-2'>
										Save <span> <CiEdit /></span>
									</div>
								</button>
							</div>
						</Form>
					</Formik>
				</div>
			</div>
		</section>
	)
}

export default Setting