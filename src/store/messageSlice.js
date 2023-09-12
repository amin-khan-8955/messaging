import { createSlice, current } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        user: null,
        recentMessages: []
    },
    reducers: {
        setMessageUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("messageUser", JSON.stringify(action.payload));
        },
        setRecentMessages: (state, action) => {
            state.recentMessages = action.payload;
        },
        addRecentMessages: (state, action) => {
            state.recentMessages.push(action.payload);
        },
        seenRecentMessage: (state, action) => {
            const currentIndex = state.recentMessages.findIndex(m => m.id === action.payload);
            state.recentMessages[currentIndex].seen = true;
        },
        editRecentMessage: (state, action) => {
            const currentIndex = state.recentMessages.findIndex(m => m.id === action.payload.id);
            state.recentMessages[currentIndex] = action.payload;
        },
        deleteRecentMessage: (state, action) => {
            const currentIndex = state.recentMessages.findIndex(m => m.id == action.payload);
            state.recentMessages.splice(currentIndex, 1);
        }
    },
})

// Action creators are generated for each case reducer function
export const { setMessageUser, setRecentMessages, addRecentMessages, seenRecentMessage, editRecentMessage, deleteRecentMessage } = messageSlice.actions
export default messageSlice.reducer;