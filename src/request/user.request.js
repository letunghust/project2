import { api } from "../utils/api.util.js";
export const getUser = async () => {
    const { data } = await api.get(`/user`);
    return data;
};

export const updateUserData = async (body) => {
    const response = await api.put("/user", body);
    return response.data;
};

export const changePassword = async (body) => {
    const response = await api.post("/auth/change-password", body);
    return response.data;
};
