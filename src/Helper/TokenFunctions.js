const ACCESS_TOKEN_NAME = "AccessToken";

export const GetAccessToken = () => {
    localStorage.getItem(ACCESS_TOKEN_NAME);
}

export const SetAccessToken = (newAccessToken) => {
    localStorage.setItem(ACCESS_TOKEN_NAME, newAccessToken);
}

export const RemoveAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
}
