const Supplier = require("../models/supplierModel");
const Purchase = require("../models/purchaseModel");

const getSuppliers = async (storeId) => {
    return await Supplier.getAllSuppliers(storeId);
};

const getSupplier = async (id, storeId) => {
    const supplier = await Supplier.getSupplierById(id, storeId);

    if (!supplier) {
        throw new Error("Supplier not found.");
    }

    return supplier;
};

const createSupplier = async (data, storeId) => {
    if (!data.name || data.name.trim() === "") {
        throw new Error("Supplier name is required.");
    }

    const exists = await Supplier.getSupplierByName(
        data.name.trim(),
        storeId
    );

    if (exists) {
        throw new Error("Supplier already exists.");
    }

    const id = await Supplier.createSupplier({
        ...data,
        name: data.name.trim(),
        store_id: storeId
    });

    return await Supplier.getSupplierById(id, storeId);
};

const updateSupplier = async (id, data, storeId) => {
    const supplier = await Supplier.getSupplierById(id, storeId);

    if (!supplier) {
        throw new Error("Supplier not found.");
    }

    if (!data.name || data.name.trim() === "") {
        throw new Error("Supplier name is required.");
    }

    const duplicate = await Supplier.getSupplierByNameExcludingId(
        data.name.trim(),
        id,
        storeId
    );

    if (duplicate) {
        throw new Error("Supplier name already exists.");
    }

    await Supplier.updateSupplier(
        id,
        {
            ...data,
            name: data.name.trim()
        },
        storeId
    );

    return await Supplier.getSupplierById(id, storeId);
};

const deleteSupplier = async (id, storeId) => {
    const supplier = await Supplier.getSupplierById(id, storeId);

    if (!supplier) {
        throw new Error("Supplier not found.");
    }

    const purchases = await Purchase.countPurchasesBySupplier(
        id,
        storeId
    );

    if (purchases > 0) {
        throw new Error(
            "Cannot delete supplier. Purchase history exists."
        );
    }

    await Supplier.deleteSupplier(id, storeId);

    return {
        message: "Supplier deleted successfully."
    };
};

const searchSuppliers = async (query, storeId) => {
    return await Supplier.searchSuppliers(query, storeId);
};

const getSuppliersPaginated = async (page, limit, storeId) => {
    return await Supplier.getSuppliersPaginated(
        page,
        limit,
        storeId
    );
};

const getSupplierStatistics = async (storeId) => {
    return await Supplier.getSupplierStatistics(storeId);
};

module.exports = {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    getSuppliersPaginated,
    getSupplierStatistics
};
