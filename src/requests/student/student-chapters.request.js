import { api } from '../../utils/api.util.js';

export const getListChapters = async (params) => {
    const { data } = await api.get('/student/chapters', { params });
    return data;
};

export const getChapterByID = async (id) => {
    const { data } = await api.get(`/student/chapters/${id}`);
    return data;
};
