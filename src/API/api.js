import axios from "axios";
import { GetAccessToken, GetRefreshToken, SetAccessToken, SetRefreshToken } from "../Helper/TokenFunctions";
import { store } from '../Store/store';
import { userLogin } from "../Store/userSlice";

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
                const res = await instance.post("refresh", { accessToken: GetAccessToken(), refreshToken: GetRefreshToken() });

                if (res.data.successfully === true) {
                    console.log("Токени успішно оновлено");
                    store.dispatch(userLogin(res.data.data));
                    SetAccessToken(res.data.data.accessToken);
                    SetRefreshToken(res.data.data.refreshToken);
                    instance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${res.data.data.accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
                    return instance(originalRequest);
                } else {
                    console.log("Токени не оновлено");
                }
            } catch (error) {
                console.error("Помилка під час оновлення токенів:", error);
            }
        }
        return Promise.reject(error);
    }
);
