import api from "./axios";

export const loginUser = async ({
    storeCode,
    username,
    password
}) => {

    const response = await api.post(
        "/auth/login",
        {
            storeCode,
            username,
            password
        }
    );

    return response.data;
};


export const getCurrentUser = async () => {

    const response =
        await api.get("/auth/me");

    return response.data;
};