import api from "./axios";

export const getPurchases = async () => {
    const response = await api.get("/purchases");
    return response.data;
};

export const getPurchase = async (id) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
};

export const createPurchase = async (purchaseData) => {
    const response = await api.post("/purchases", purchaseData);
    return response.data;
};

export const searchPurchases = async (keyword) => {
    const response = await api.get("/purchases/search", {
        params: { keyword }
    });
    return response.data;
};

export const getPurchasesPaginated = async (page = 1, limit = 10) => {
    const response = await api.get("/purchases/page/list", {
        params: { page, limit }
    });
    return response.data;
};

export const getPurchaseStatistics = async () => {
    const response = await api.get("/purchases/stats");
    return response.data;
};

export const cancelPurchase = async (id) => {
    const response = await api.patch(`/purchases/${id}/cancel`);
    return response.data;
};
