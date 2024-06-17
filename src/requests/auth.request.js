import { api, silentApi } from '../utils/api.util.js';
import { setAccessToken } from '../utils/token.util.js';

export const register = async (body) => {
    const { data } = await api.post('/auth/register', body);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};

export const login = async (body) => {
    const { data } = await api.post('/auth/login', body);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};

export const refreshAccessToken = async () => {
    const { data } = await silentApi.get('/auth/refresh-token');
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};

export const changePassword = async (body) => {
    const { data } = await api.post('/auth/change-password', body);
    return data;
};
