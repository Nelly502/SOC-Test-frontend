import { api } from '../../utils/api.util.js';

export const getClasses = async (params) => {
    const { data } = await api.get('/student/classes', { params });
    return data;
};

export const hideShowClass = async (id, hidden) => {
    const { data } = await api.patch(`/student/classes/${id}`, { hidden });
    return data;
};

export const getClassById = async (id) => {
    const { data } = await api.get(`/student/classes/${id}`);
    return data;
};

export const joinClass = async (body) => {
    const { data } = await api.post('/student/classes/join', body);
    return data;
};

export const leaveClass = async (id) => {
    const { data } = await api.delete(`/student/classes/${id}`);
    return data;
};
