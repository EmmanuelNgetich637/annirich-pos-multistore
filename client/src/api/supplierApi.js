import api from "./axios";

export const getSuppliers = async () => {
    const response = await api.get("/suppliers");
    return response.data;
};

export const getSupplier = async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
};

export const createSupplier = async (supplierData) => {
    const response = await api.post("/suppliers", supplierData);
    return response.data;
};

export const updateSupplier = async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
};

export const searchSuppliers = async (keyword) => {
    const response = await api.get("/suppliers/search", {
        params: { q: keyword }
    });
    return response.data;
};

export const getSuppliersPaginated = async (page = 1, limit = 10) => {
    const response = await api.get("/suppliers/page/list", {
        params: { page, limit }
    });
    return response.data;
};

export const getSupplierStatistics = async () => {
    const response = await api.get("/suppliers/stats");
    return response.data;
};
