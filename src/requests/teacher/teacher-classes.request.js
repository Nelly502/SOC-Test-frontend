import { api } from '../../utils/api.util.js';

export const createClass = async (body) => {
    const { data } = await api.post('/teacher/classes', body);
    return data;
};

export const getClasses = async (params) => {
    const { data } = await api.get('/teacher/classes', { params });
    return data;
};

export const hideShowClass = async (id, hidden) => {
    const { data } = await api.patch(`/teacher/classes/${id}`, { hidden });
    return data;
};

export const getClassByID = async (id) => {
    const { data } = await api.get(`/teacher/classes/${id}`);
    return data;
};

export const updateClass = async (id, body) => {
    const { data } = await api.put(`/teacher/classes/${id}`, body);
    return data;
};

export const deleteClasses = async (ids) => {
    const { data } = await api.delete('/teacher/classes', { data: { ids } });
    return data;
};
