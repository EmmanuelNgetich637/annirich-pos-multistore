import api from "./axios";

export const getReportSummary = async (startDate, endDate) => {
    const response = await api.get("/reports/summary", {
        params: { startDate, endDate }
    });

    return response.data;
};

export const getSalesTrend = async (startDate, endDate) => {
    const response = await api.get("/reports/trend", {
        params: { startDate, endDate }
    });

    return response.data;
};

export const getSalesByCategory = async (startDate, endDate) => {
    const response = await api.get("/reports/categories", {
        params: { startDate, endDate }
    });

    return response.data;
};

export const getTopProducts = async (startDate, endDate) => {
    const response = await api.get("/reports/top-products", {
        params: { startDate, endDate }
    });

    return response.data;
};
