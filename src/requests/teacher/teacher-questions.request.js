import { api } from '../../utils/api.util.js';

export const createQuestion = async (body) => {
    const { data } = await api.post('/teacher/questions', body);
    return data;
};

export const getListQuestionsTeacher = async (params) => {
    const { data } = await api.get('/teacher/questions', { params });
    return data;
};

export const getQuestionByIdTeacher = async (id) => {
    const { data } = await api.get(`/teacher/questions/${id}`);
    return data;
};

export const updateQuestion = async (id, body) => {
    const { data } = await api.put(`/teacher/questions/${id}`, body);
    return data;
};

export const deleteQuestion = async (ids) => {
    const { data } = await api.delete('/teacher/questions', { data: { ids } });
    return data;
};
