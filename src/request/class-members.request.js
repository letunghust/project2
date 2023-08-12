import { api } from "../utils/api.util.js";

export const getMembersTeacher = async (params) => {
    const { data } = await api.get("/teacher/members", { params });
    return data;
};

export const getMembersStudent = async (params) => {
    const { data } = await api.get("/student/members", { params });
    return data;
};

export const addMember = async (body) => {
    const { data } = await api.post(`/teacher/members`, body);
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

export const getUsers = async (id) => {
    const { data } = await api.get(`/teacher/members/users`);
    return data;
};

export const acceptMember = async (body) => {
    const { data } = await api.put("/teacher/members/", body);
    return data;
};

export const joinClass = async (body) => {
    const { data } = await api.post("/student/classes/join", body);
    return data;
};

export const checkAttendance = async (params) => {
    const response = await api.get("/teacher/members/check", { params });
    return response.data;
};
