const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Receipt By Sale ID
|--------------------------------------------------------------------------
*/

const getReceiptBySaleId = async (
    saleId,
    storeId
) => {

    /*
    |--------------------------------------------------------------------------
    | Sale Information
    |--------------------------------------------------------------------------
    */

    const [sales] = await db.query(
        `
        SELECT
            s.id,
            s.store_id,
            s.created_at,
            s.payment_method,
            s.subtotal,
            s.discount,
            s.total,

            c.name AS customer_name,

            u.full_name AS cashier_name

        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.id = ?
        AND s.store_id = ?

        LIMIT 1
        `,
        [
            saleId,
            storeId
        ]
    );

    if (sales.length === 0) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Business Settings
    |--------------------------------------------------------------------------
    */

    const [settings] = await db.query(
        `
        SELECT
            business_name,
            phone,
            email,
            address,
            receipt_footer
        FROM settings
        WHERE store_id = ?
        LIMIT 1
        `,
        [storeId]
    );


    /*
    |--------------------------------------------------------------------------
    | Sale Items
    |--------------------------------------------------------------------------
    */

    const [items] = await db.query(
        `
        SELECT
            p.name AS product_name,
            si.quantity,
            si.selling_price,
            (si.quantity * si.selling_price) AS total

        FROM sale_items si

        LEFT JOIN products p
            ON si.product_id = p.id
            AND p.store_id = si.store_id

        WHERE si.sale_id = ?
        AND si.store_id = ?

        ORDER BY si.id ASC
        `,
        [
            saleId,
            storeId
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Return Receipt
    |--------------------------------------------------------------------------
    */

    return {

        business:
            settings.length > 0
                ? settings[0]
                : {},

        sale:
            sales[0],

        items

    };

};


module.exports = {
    getReceiptBySaleId
};