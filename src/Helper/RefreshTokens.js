import { instance } from "../API/api";
import { store } from "../Store/store";
import { userLogin } from "../Store/userSlice";
import { GetAccessToken, GetRefreshToken, RemoveAccessToken, RemoveRefreshToken, SetAccessToken, SetRefreshToken } from "./TokenFunctions";

export const RefreshTokens = async () => {
    try {
        const res = await instance.post("refresh", { accessToken: GetAccessToken(), refreshToken: GetRefreshToken() });

        if (res.data.successfully === true) {
            console.log("Токени успішно оновлено");
            store.dispatch(userLogin(res.data.data));
            RemoveAccessToken();
            SetAccessToken(res.data.data.accessToken);
            RemoveRefreshToken();
            SetRefreshToken(res.data.data.refreshToken);
            instance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${res.data.data.accessToken}`;
            window.location.reload();
        } else {
            console.log("Токени не оновлено:", res.data.message);
        }

        return res;
    } catch (error) {
        console.error("Помилка під час оновлення токенів:", error);
    }
}