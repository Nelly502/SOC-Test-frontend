import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
    name: 'config',
    initialState: null,
    reducers: {
        updateConfig(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        removeConfig(state) {
            return null;
        },
    },
});

export const configReducer = configSlice.reducer;

export const { updateConfig, removeConfig } = configSlice.actions;
