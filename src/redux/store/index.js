import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../slices/user.slice.js';
import { configReducer } from '../slices/config.slice.js';
export const store = configureStore({
    reducer: {
        user: userReducer,
        config: configReducer,
    },
});
