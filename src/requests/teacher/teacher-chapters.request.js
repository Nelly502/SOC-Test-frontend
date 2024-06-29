import { api } from '../../utils/api.util.js';

export const createChapter = async (body) => {
    const { data } = await api.post('/teacher/chapters', body);
    return data;
};

export const getListChaptersTeacher = async (params) => {
    const { data } = await api.get('/teacher/chapters', { params });
    return data;
};

export const getChapterByIdTeacher = async (id) => {
    const { data } = await api.get(`/teacher/chapters/${id}`);
    return data;
};

export const updateChapter = async (id, body) => {
    const { data } = await api.put(`/teacher/chapters/${id}`, body);
    return data;
};

export const deleteChapter = async (ids) => {
    const { data } = await api.delete('/teacher/chapters', { data: { ids } });
    return data;
};
