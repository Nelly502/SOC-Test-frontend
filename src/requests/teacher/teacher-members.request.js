import { api } from '../../utils/api.util.js';

export const getTeachers = async (params) => {
    const { data } = await api.get(`/teacher/members/teachers`, { params });
    return data;
};

export const getStudents = async (params) => {
    const { data } = await api.get(`/teacher/members/students`, { params });
    return data;
};

export const addMember = async (body) => {
    const { data } = await api.post(`/teacher/members`, body);
    return data;
};

export const acceptMember = async (id) => {
    const { data } = await api.patch(`/teacher/members/${id}`);
    return data;
};

export const deleteMember = async (classId, ids) => {
    const { data } = await api.delete(`/teacher/members`, {
        data: {
            classId,
            ids,
        },
    });
    return data;
};

export const getUsers = async (params) => {
    const { data } = await api.get(`/teacher/members/users`, { params });
    return data;
};
