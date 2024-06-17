import { api } from '../utils/api.util.js';
import { setAccessToken } from '../utils/token.util.js';

export const updateUserRequest = async (body) => {
    const { data } = await api.post('/user', body);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};

export const deleteUserRequest = async () => {
    const { data } = await api.delete(`/user/`);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};
