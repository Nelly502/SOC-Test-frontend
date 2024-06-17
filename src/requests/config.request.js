import { api } from '../utils/api.util.js';

export const getConstants = async () => {
    const { data } = await api.get('/config/constants');
    return data;
};
