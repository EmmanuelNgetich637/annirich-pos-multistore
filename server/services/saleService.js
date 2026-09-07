const db = require("../config/db");

const Sale = require("../models/saleModel");


// CREATE SALE
const createSale = async (
    data,
    userId,
    storeId
) => {

    const connection =
        await db.getConnection();


    try {

        await connection.beginTransaction();


        if (
            !data.items ||
            !Array.isArray(data.items) ||
            data.items.length === 0
        ) {
            throw new Error(
                "Sale items are required."
            );
        }


        if (!data.payment_method) {
            throw new Error(
                "Payment method is required."
            );
        }


        let subtotal = 0;


        // Validate customer if supplied
        if (data.customer_id) {

            const [customers] =
                await connection.query(
                    `
                    SELECT id
                    FROM customers
                    WHERE id = ?
                    AND store_id = ?
                    LIMIT 1
                    `,
                    [
                        data.customer_id,
                        storeId
                    ]
                );


            if (!customers[0]) {
                throw new Error(
                    "Customer not found in this store."
                );
            }

        }


        // Validate every product
        for (const item of data.items) {

            if (!item.product_id) {

                throw new Error(
                    "Product ID is required."
                );

            }


            if (
                !item.quantity ||
                item.quantity <= 0
            ) {

                throw new Error(
                    "Invalid quantity."
                );

            }


            if (
                item.selling_price === undefined ||
                item.selling_price === null ||
                item.selling_price < 0
            ) {

                throw new Error(
                    "Invalid selling price."
                );

            }


            const [products] =
                await connection.query(
                    `
                    SELECT
                        id,
                        name,
                        quantity
                    FROM products

                    WHERE id = ?
                    AND store_id = ?
                    AND status = 'active'

                    LIMIT 1
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );


            if (!products[0]) {

                throw new Error(
                    `Product ${item.product_id} not found in this store.`
                );

            }


            const product =
                products[0];


            if (
                product.quantity <
                item.quantity
            ) {

                throw new Error(
                    `Insufficient stock for ${product.name}.`
                );

            }


            subtotal +=
                Number(item.quantity) *
                Number(item.selling_price);

        }


        const discount =
            Number(data.discount || 0);


        if (discount < 0) {

            throw new Error(
                "Invalid discount."
            );

        }


        if (discount > subtotal) {

            throw new Error(
                "Discount cannot exceed subtotal."
            );

        }


        const total =
            subtotal - discount;


        // Create sale
        const [saleResult] =
            await connection.query(
                `
                INSERT INTO sales
                (
                    store_id,
                    customer_id,
                    cashier_id,
                    payment_method,
                    subtotal,
                    discount,
                    total
                )

                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    data.customer_id || null,
                    userId,
                    data.payment_method,
                    subtotal,
                    discount,
                    total
                ]
            );


        const saleId =
            saleResult.insertId;


        // Process sale items
        for (const item of data.items) {


            await connection.query(
                `
                INSERT INTO sale_items
                (
                    store_id,
                    sale_id,
                    product_id,
                    quantity,
                    selling_price
                )

                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    saleId,
                    item.product_id,
                    item.quantity,
                    item.selling_price
                ]
            );


            // Lock product row before changing stock
            const [products] =
                await connection.query(
                    `
                    SELECT quantity
                    FROM products

                    WHERE id = ?
                    AND store_id = ?

                    FOR UPDATE
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );


            if (!products[0]) {

                throw new Error(
                    "Product not found."
                );

            }


            const newBalance =
                products[0].quantity -
                item.quantity;


            if (newBalance < 0) {

                throw new Error(
                    "Insufficient stock."
                );

            }


            // Reduce stock
            await connection.query(
                `
                UPDATE products

                SET quantity = ?

                WHERE id = ?
                AND store_id = ?
                `,
                [
                    newBalance,
                    item.product_id,
                    storeId
                ]
            );


            // Stock movement
            await connection.query(
                `
                INSERT INTO stock_movements
                (
                    store_id,
                    product_id,
                    reference_id,
                    reference_type,
                    movement_type,
                    quantity,
                    balance_after,
                    remarks
                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    item.product_id,
                    saleId,
                    "Sale",
                    "Sale",
                    item.quantity,
                    newBalance,
                    "Sale Stock Out"
                ]
            );

        }


        await connection.commit();


        return {

            saleId,

            subtotal,

            discount,

            total

        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// GET ALL SALES
const getSales = async (storeId) => {

    return await Sale.getAllSales(
        storeId
    );

};


// GET SALE
const getSale = async (
    id,
    storeId
) => {

    const sale =
        await Sale.getSaleById(
            id,
            storeId
        );


    if (!sale) {

        throw new Error(
            "Sale not found."
        );

    }


    return sale;

};


// SEARCH
const searchSales = async (
    keyword,
    storeId
) => {

    return await Sale.searchSales(
        keyword,
        storeId
    );

};


// PAGINATION
const getSalesPaginated = async (
    page,
    limit,
    storeId
) => {

    return await Sale.getSalesPaginated(
        page,
        limit,
        storeId
    );

};


// STATISTICS
const getSaleStatistics = async (
    storeId
) => {

    return await Sale.getSaleStatistics(
        storeId
    );

};


module.exports = {

    createSale,

    getSales,

    getSale,

    searchSales,

    getSalesPaginated,

    getSaleStatistics

};
