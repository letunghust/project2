import { api } from "../utils/api.util.js";
import { setAccessToken } from "../utils/storage.util.js";

export const login = async (body) => {
    const response = await api.post("auth/login", body);
    setAccessToken(response.data?.accessToken);
    return response.data;
};

export const refreshAccessToken = async (config) => {
    const response = await api.get("auth/refresh-token", config);
    setAccessToken(response.data?.accessToken);
    return response.data;
};

export const register = async (body) => {
    const response = await api.post("auth/register", body);
    return response.data;
};
