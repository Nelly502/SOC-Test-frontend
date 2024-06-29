import { api } from '../../utils/api.util.js';

export const getListSubjectsStudent = async (params) => {
    const { data } = await api.get('/student/subjects', { params });
    return data;
};

export const getSubjectByIdStudent = async (id) => {
    const { data } = await api.get(`/student/subjects/${id}`);
    return data;
};
