const db = require("../config/db");

const Mpesa = {
    async createTransaction(data) {
        const [result] = await db.execute(
            `INSERT INTO mpesa_transactions (
                store_id,
                sale_id,
                merchant_request_id,
                checkout_request_id,
                phone_number,
                amount,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.store_id,
                data.sale_id || null,
                data.merchant_request_id || null,
                data.checkout_request_id || null,
                data.phone_number,
                data.amount,
                data.status || "pending",
            ]
        );

        return result.insertId;
    },

    async findByCheckoutRequestId(checkoutRequestId) {
        const [rows] = await db.execute(
            `SELECT *
             FROM mpesa_transactions
             WHERE checkout_request_id = ?
             LIMIT 1`,
            [checkoutRequestId]
        );

        return rows[0] || null;
    },

    async findByMerchantRequestId(merchantRequestId) {
        const [rows] = await db.execute(
            `SELECT *
             FROM mpesa_transactions
             WHERE merchant_request_id = ?
             LIMIT 1`,
            [merchantRequestId]
        );

        return rows[0] || null;
    },

    async findById(id, storeId) {
        const [rows] = await db.execute(
            `SELECT *
             FROM mpesa_transactions
             WHERE id = ?
             AND store_id = ?
             LIMIT 1`,
            [id, storeId]
        );

        return rows[0] || null;
    },

    async updateTransaction(id, data) {
        const fields = [];
        const values = [];

        if (data.mpesa_receipt_number !== undefined) {
            fields.push("mpesa_receipt_number = ?");
            values.push(data.mpesa_receipt_number);
        }

        if (data.transaction_date !== undefined) {
            fields.push("transaction_date = ?");
            values.push(data.transaction_date);
        }

        if (data.result_code !== undefined) {
            fields.push("result_code = ?");
            values.push(data.result_code);
        }

        if (data.result_desc !== undefined) {
            fields.push("result_desc = ?");
            values.push(data.result_desc);
        }

        if (data.status !== undefined) {
            fields.push("status = ?");
            values.push(data.status);
        }

        if (!fields.length) {
            return false;
        }

        values.push(id);

        const [result] = await db.execute(
            `UPDATE mpesa_transactions
             SET ${fields.join(", ")}
             WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    },

    async listByStore(storeId) {
        const [rows] = await db.execute(
            `SELECT *
             FROM mpesa_transactions
             WHERE store_id = ?
             ORDER BY created_at DESC`,
            [storeId]
        );

        return rows;
    },
};

module.exports = Mpesa;