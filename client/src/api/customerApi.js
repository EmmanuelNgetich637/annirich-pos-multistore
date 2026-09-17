import api from "./axios";

export const getCustomers = async () => {
    const response = await api.get("/customers");
    return response.data;
};

export const getCustomer = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const createCustomer = async (customerData) => {
    const response = await api.post("/customers", customerData);
    return response.data;
};

export const updateCustomer = async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};

export const searchCustomers = async (keyword) => {
    const response = await api.get("/customers/search", {
        params: { keyword }
    });
    return response.data;
};

export const getCustomersPaginated = async (
    page = 1,
    limit = 10
) => {
    const response = await api.get("/customers/page/list", {
        params: { page, limit }
    });

    return response.data;
};

export const getCustomerStatistics = async () => {
    const response = await api.get("/customers/stats");
    return response.data;
};
