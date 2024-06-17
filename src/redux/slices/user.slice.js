import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        updateUser(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        removeUser(state) {
            return null;
        },
    },
});

export const userReducer = userSlice.reducer;

export const { updateUser, removeUser } = userSlice.actions;
