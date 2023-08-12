import { message } from "antd";
import axios from "axios";
import { getAccessToken, removeAccessToken } from "./storage.util";

export const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        // add token to headers
        if (token && config?.headers) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeAccessToken();
        }

        const configData = JSON.parse(error.config?.data);
        if (!configData.silent) {
            message.error(error.response?.data?.message);
        }
        return Promise.reject(error);
    }
);
