
import { configureStore } from '@reduxjs/toolkit';
import auth from './auth';
import connectionSlice from './connectionSlice';
import messageSlice from './messageSlice';

export default configureStore({
    reducer: {
        auth,
        connection: connectionSlice,
        message: messageSlice
    },
});
