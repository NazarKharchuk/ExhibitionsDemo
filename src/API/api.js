import axios from "axios";
import { RefreshTokens } from "../Helper/RefreshTokens";

export const instance = axios.create({
    withCredentials: true,
    baseURL: "https://localhost:44350/api/",
});

instance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await RefreshTokens();

                if (res.data.successfully === true) {
                    originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
                    return instance(originalRequest);
                }
            } catch (error) {
                console.error("Помилка під час оновлення токенів:", error);
            }
        }
        return Promise.reject(error);
    }
);
