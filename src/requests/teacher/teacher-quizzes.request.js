import { api } from '../../utils/api.util.js';

export const getListQuizzes = async (params) => {
    const { data } = await api.get('/teacher/quizzes/', { params });
    return data;
};

export const getQuizById = async (id) => {
    const { data } = await api.get(`/teacher/quizzes/${id}`);
    return data;
};

export const createQuiz = async (body) => {
    const { data } = await api.post('/teacher/quizzes', body);
    return data;
};

export const updateQuiz = async (id, body) => {
    const { data } = await api.put(`/teacher/quizzes/${id}`, body);
    return data;
};

export const deleteQuizzes = async (ids) => {
    const { data } = await api.delete('/teacher/quizzes', { data: { ids } });
    return data;
};
