import { api } from '../../utils/api.util.js';

export const getListMembers = async (params) => {
    const { data } = await api.get(`/admin/members/users`, { params });
    return data;
};

export const deleteMember = async (id) => {
    const { data } = await api.delete(`/admin/members/${id}`);
    return data;
};
