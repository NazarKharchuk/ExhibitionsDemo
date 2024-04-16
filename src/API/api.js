import axios from "axios";

export const instance = axios.create({
    withCredentials: true,
    baseURL: "https://localhost:44350/api/",
});
