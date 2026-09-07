const Customer = require("../models/customerModel");

const getCustomers = async (storeId) => {
    return await Customer.getAllCustomers(storeId);
};

const getCustomer = async (id, storeId) => {
    const customer =
        await Customer.getCustomerById(id, storeId);

    if (!customer) {
        throw new Error("Customer not found.");
    }

    return customer;
};

const createCustomer = async (data, storeId) => {
    const phoneExists =
        await Customer.getCustomerByPhone(
            data.phone,
            storeId
        );

    if (phoneExists) {
        throw new Error("Phone number already exists.");
    }

    if (data.email) {
        const emailExists =
            await Customer.getCustomerByEmail(
                data.email,
                storeId
            );

        if (emailExists) {
            throw new Error("Email already exists.");
        }
    }

    const id =
        await Customer.createCustomer({
            ...data,
            store_id: storeId
        });

    return await Customer.getCustomerById(
        id,
        storeId
    );
};

const updateCustomer = async (
    id,
    data,
    storeId
) => {
    const customer =
        await Customer.getCustomerById(
            id,
            storeId
        );

    if (!customer) {
        throw new Error("Customer not found.");
    }

    const phoneExists =
        await Customer.getCustomerByPhoneExcludingId(
            data.phone,
            id,
            storeId
        );

    if (phoneExists) {
        throw new Error("Phone number already exists.");
    }

    if (data.email) {
        const emailExists =
            await Customer.getCustomerByEmailExcludingId(
                data.email,
                id,
                storeId
            );

        if (emailExists) {
            throw new Error("Email already exists.");
        }
    }

    return await Customer.updateCustomer(
        id,
        data,
        storeId
    );
};

const deleteCustomer = async (
    id,
    storeId
) => {
    const customer =
        await Customer.getCustomerById(
            id,
            storeId
        );

    if (!customer) {
        throw new Error("Customer not found.");
    }

    const deleted =
        await Customer.deleteCustomer(
            id,
            storeId
        );

    return deleted;
};

const searchCustomers = async (
    keyword,
    storeId
) => {
    return await Customer.searchCustomers(
        keyword,
        storeId
    );
};

const getCustomersPaginated = async (
    page,
    limit,
    storeId
) => {
    return await Customer.getCustomersPaginated(
        page,
        limit,
        storeId
    );
};

const getCustomerStatistics = async (
    storeId
) => {
    return await Customer.getCustomerStatistics(
        storeId
    );
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomersPaginated,
    getCustomerStatistics
};
