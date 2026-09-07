const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

const getSettings = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM settings
        WHERE store_id = ?
        LIMIT 1
        `,
        [storeId]
    );

    return rows[0] || null;
};


/*
|--------------------------------------------------------------------------
| Create Settings
|--------------------------------------------------------------------------
*/

const createSettings = async (data, storeId) => {

    const {
        business_name,
        phone,
        email,
        address,
        receipt_footer
    } = data;

    const [result] = await db.query(
        `
        INSERT INTO settings
        (
            store_id,
            business_name,
            phone,
            email,
            address,
            receipt_footer
        )
        VALUES
        (?, ?, ?, ?, ?, ?)
        `,
        [
            storeId,
            business_name,
            phone,
            email,
            address,
            receipt_footer
        ]
    );

    return result.insertId;
};


/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

const updateSettings = async (data, storeId) => {

    const {
        business_name,
        phone,
        email,
        address,
        receipt_footer
    } = data;

    await db.query(
        `
        UPDATE settings
        SET
            business_name = ?,
            phone = ?,
            email = ?,
            address = ?,
            receipt_footer = ?
        WHERE store_id = ?
        `,
        [
            business_name,
            phone,
            email,
            address,
            receipt_footer,
            storeId
        ]
    );

    return getSettings(storeId);
};


module.exports = {
    getSettings,
    createSettings,
    updateSettings
};