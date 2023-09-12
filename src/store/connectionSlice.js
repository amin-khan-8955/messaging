import { createSlice } from '@reduxjs/toolkit'

export const connectionSlice = createSlice({
    name: 'connection',
    initialState: {
        connectedUsers: [],
        requstedUsers: [],
        pandingUsers: [],
        allUsers: [],
    },

    reducers: {
        setConnectUsers: (state, action) => {
            state.connectedUsers = action.payload;
        },

        setRequestedUsers: (state, action) => {
            state.requstedUsers = action.payload;
        },

        setPandingUsers: (state, action) => {
            state.pandingUsers = action.payload;
        },

        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },

        addToRequestedUsers: (state, action) => {
            state.requstedUsers.push(action.payload);
            state.allUsers = state.allUsers.filter(user => user.id !== action.payload.id);
        },
        removeToRequestUsers: (state, action) => {
            state.allUsers.push(action.payload);
            state.requstedUsers = state.requstedUsers.filter(user => user.id !== action.payload.id);
        },

        addToPandingUsers: (state, action) => {
            state.pandingUsers.push(action.payload);
            state.allUsers = state.allUsers.filter(user => user.id !== action.payload.id);
        },
        removeToPandingUsers: (state, action) => {
            state.allUsers.push(action.payload);
            state.pandingUsers = state.pandingUsers.filter(user => user.id !== action.payload.id);
        },
        addToConnectedUsers: (state, action) => {
            state.connectedUsers.push(action.payload);
            state.pandingUsers = state.allUsers.filter(user => user.id !== action.payload.id);
            state.requstedUsers = state.allUsers.filter(user => user.id !== action.payload.id);
        },
        addMessageCountToConnectedUsers: (state, action) => {
            const userIndex = state.connectedUsers?.findIndex(user => user.id === action.payload);
            if (userIndex !== -1) {
                state.connectedUsers[userIndex].messageCount = state.connectedUsers[userIndex]?.messageCount
                    ? state.connectedUsers[userIndex].messageCount + 1
                    : 1
            }


        },
        removeMessageCountToConnectedUsers: (state, action) => {
            const userIndex = state.connectedUsers?.findIndex(user => user.id === action.payload);
            console.log("userIndex", userIndex);
            state.connectedUsers[userIndex].messageCount = 0;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setConnectUsers,
    setAllUsers,
    setRequestedUsers,
    setPandingUsers,
    addToRequestedUsers,
    addToPandingUsers,
    addToConnectedUsers,
    removeToPandingUsers,
    removeToRequestUsers,
    addMessageCountToConnectedUsers,
    removeMessageCountToConnectedUsers
} = connectionSlice.actions

export default connectionSlice.reducer;