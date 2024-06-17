import { api } from '../../utils/api.util.js';

export const getListQuizzes = async (params) => {
    const { data } = await api.get('/student/quizzes/', { params });
    return data;
};

export const getQuizById = async (id) => {
    const { data } = await api.get(`/student/quizzes/${id}`);
    return data;
};

export const doQuiz = async (id, body) => {
    const { data } = await api.post(`/student/quizzes/${id}`, body);
    return data;
};
