import api from "./axios";

export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
};

export const getCategory = async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await api.post(
        "/categories",
        categoryData
    );

    return response.data;
};

export const updateCategory = async (
    id,
    categoryData
) => {
    const response = await api.put(
        `/categories/${id}`,
        categoryData
    );

    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(
        `/categories/${id}`
    );

    return response.data;
};

export const searchCategories = async (query) => {
    const response = await api.get(
        `/categories/search?q=${encodeURIComponent(query)}`
    );

    return response.data;
};

export const getCategoryStatistics = async () => {
    const response = await api.get(
        "/categories/statistics"
    );

    return response.data;
};
