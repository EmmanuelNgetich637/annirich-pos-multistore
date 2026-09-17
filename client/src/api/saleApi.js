import api from "./axios";

export const createSale = async (saleData) => {
    const response = await api.post(
        "/sales",
        saleData
    );

    return response.data;
};

export const getSales = async () => {
    const response = await api.get(
        "/sales"
    );

    return response.data;
};

export const getSale = async (id) => {
    const response = await api.get(
        `/sales/${id}`
    );

    return response.data;
};

export const searchSales = async (keyword) => {
    const response = await api.get(
        "/sales/search",
        {
            params: {
                keyword
            }
        }
    );

    return response.data;
};

export const getSalesPaginated = async (
    page = 1,
    limit = 10
) => {
    const response = await api.get(
        "/sales/page/list",
        {
            params: {
                page,
                limit
            }
        }
    );

    return response.data;
};

export const getSaleStatistics = async () => {
    const response = await api.get(
        "/sales/stats"
    );

    return response.data;
};
