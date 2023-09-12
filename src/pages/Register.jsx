import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage, } from 'formik';
import * as Yup from 'yup';
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { firebaseApp } from '../config/firebase';
import { collection, addDoc, getFirestore } from "firebase/firestore";


const Register = () => {
  const navigate = useNavigate();

  const registerClickHandler = async (value) => {
    try {

      //create new use in firebase auth
      const auth = await createUserWithEmailAndPassword(
        getAuth(firebaseApp),
        value.email,
        value.password
      );

      //to store user in firestore database collectin
      await addDoc(
        collection(getFirestore(firebaseApp), "users"),
        {
          username: value.username,
          email: value.email,
          uid: auth.user.uid,
        }
      );

      navigate("/login");
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  }


  const registerSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, "Too Short!").required('Required'),
    cPassword: Yup.string().required('Required!')
      .oneOf([Yup.ref('password')], 'Must be same as Paword')
  });

  const ErrMassage = ({ name }) => <ErrorMessage name={name} render={msg =>
    <div className='text-red-500 text-sm'>{msg}</div>}
  />

  return (
    <div>
      <h1 className='text-center font-bold text-2xl pt-8'>
        Register
      </h1>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          cPassword: '',
        }}
        validationSchema={registerSchema}
        onSubmit={registerClickHandler}
      >
        <Form action="" className='p-3 m-3'>

          <div className='p-2 mb-1'>
            <label className='' htmlFor="">Username</label>
            <div className='mt-1'>
              <Field type="text" name="username"
                className=' w-full outline-none'
                placeholder='type your username' />
              <hr className='border-gray-500 mt-1 ' />
              <ErrMassage name="firstname" />
            </div>
          </div>
          <div className='p-2 mb-1'>
            <label className='' htmlFor="">Email</label>
            <div className='mt-1'>
              <Field type="email" name="email"
                className=' w-full outline-none' placeholder='type your username' />
              <hr className='border-gray-500 mt-1 ' />
              <ErrMassage name="email" />

            </div>
          </div>
          <div className='p-2 mb-1'>
            <label className='' htmlFor="">password</label>
            <div className='mt-1'>
              <Field type="password" name="password"
                className=' w-full outline-none' placeholder='type your password' />
              <hr className='border-gray-500 mt-1 ' />
              <ErrMassage name="password" />

            </div>
          </div>
          <div className='p-2 mb-1'>
            <label className='' htmlFor="">Confirm password</label>
            <div className='mt-1'>
              <Field type="password" name="cPassword"
                className=' w-full outline-none' placeholder='type your password' />
              <hr className='border-gray-500 mt-1 ' />
              <ErrMassage name="cPassword" />
            </div>
          </div>
          <div className='text-end mb-1'>
            <Link to="/login" className='text-gray-500'>Already Register Login here </Link>
          </div>
          <div className='text-end mb-1'>
            <Link to="#" className='text-gray-500'> forgot password</Link>
          </div>
          <div className='w-full text-center'>
            <button type='submit'
              className='bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500 w-[80%] py-1 rounded-full font-bold text-white'>
              Register
            </button>
          </div>
        </Form>
      </Formik>
      <div className='text-gray-500 text-center text-normal pb-5'>
        <div className='w-[60%] outline rounded-full mx-auto flex px-2 py-1 justify-center items-center'>
          <FcGoogle className='text-2xl m-1' />
          <p>Signin with Google</p></div>
      </div>
    </div>
  )
}

export default Register