import { message } from 'antd';
import axios from 'axios';
import { getAccessToken, removeAccessToken } from './token.util.js';

export const createApiInstance = (config, { silent = false } = {}) => {
    const api = axios.create(config);

    api.interceptors.request.use(
        (config) => {
            const accessToken = getAccessToken();
            if (config?.headers) {
                config.headers['Authorization'] = 'Bearer ' + accessToken;
            }
            return config;
        },
        (error) => {
            Promise.reject(error);
        },
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                removeAccessToken();
            }

            if (!silent) {
                message.error(error.response?.data?.message);
            }

            console.error(error);
            return Promise.reject(error);
        },
    );

    return api;
};

export const api = createApiInstance({
    baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
    },
});

export const silentApi = createApiInstance(
    {
        baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
        },
    },
    { silent: true },
);
