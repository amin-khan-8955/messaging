import { createSlice } from '@reduxjs/toolkit'
import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from '../config/firebase';


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // chaking is user is already loged in or not
        user: !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    },

    reducers: {
        login: (state, action) => {
            state.isLogin = true;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },


        logout: (state, action) => {
            signOut(getAuth(firebaseApp));
            state.isLogin = false;
            state.user = null;
            localStorage.removeItem("user");
        },
        updateAuth: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },

    },
})

// Action creators are generated for each case reducer function
export const { login, logout, updateAuth } = authSlice.actions

export default authSlice.reducer;