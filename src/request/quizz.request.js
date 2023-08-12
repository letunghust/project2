import { api } from "../utils/api.util.js";

export const createQuiz = async (body) => {
    const response = await api.post("teacher/quizzes", body);
    return response.data;
};

export const getQuizzesClassTeacher = async (params) => {
    const response = await api.get("teacher/quizzes/", { params });
    return response.data;
};

export const getQuizzesClassStudent = async (params) => {
    const response = await api.get("student/quizzes/", { params });
    return response.data;
};

export const getQuizByIdTeacher = async (id) => {
    const { data } = await api.get(`/teacher/quizzes/${id}`);
    return data;
};

export const getQuizByIdStudent = async (id) => {
    const { data } = await api.get(`/student/quizzes/${id}`);
    return data;
};

export const updateQuiz = async (id, body) => {
    const { data } = await api.put(`/teacher/quizzes/${id}`, body);
    return data;
};

export const deleteQuizzes = async (ids) => {
    const { data } = await api.delete("/teacher/quizzes", { data: { ids } });
    return data;
};

export const doQuiz = async (id, body) => {
    const { data } = await api.post(`/student/quizzes/${id}`, body);
    return data;
};
