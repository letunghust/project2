export const setAccessToken = (token) => {
    if (token) {
        localStorage.setItem(process.env.ACCESS_TOKEN_KEY || "access_token", token);
    }
};

export const getAccessToken = () => {
    return localStorage.getItem(process.env.ACCESS_TOKEN_KEY || "access_token");
};

export const removeAccessToken = () => {
    localStorage.removeItem(process.env.ACCESS_TOKEN_KEY || "access_token");
};
