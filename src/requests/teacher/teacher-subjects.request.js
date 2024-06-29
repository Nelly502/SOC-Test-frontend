import { api } from '../../utils/api.util.js';

export const createSubject = async (body) => {
    const { data } = await api.post('/teacher/subjects', body);
    return data;
};

export const getListSubjectsTeacher = async (params) => {
    const { data } = await api.get('/teacher/subjects', { params });
    return data;
};

export const getSubjectByIdTeacher = async (id) => {
    const { data } = await api.get(`/teacher/subjects/${id}`);
    return data;
};

export const updateSubject = async (id, body) => {
    const { data } = await api.put(`/teacher/subjects/${id}`, body);
    return data;
};

export const deleteSubject = async (ids) => {
    const { data } = await api.delete('/teacher/subjects', { data: { ids } });
    return data;
};
