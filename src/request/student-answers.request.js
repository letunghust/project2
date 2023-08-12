import { api } from "../utils/api.util.js";

export const getStudentAnswers = async (params) => {
    const response = await api.get("teacher/student-answers", { params });
    return response.data;
};
