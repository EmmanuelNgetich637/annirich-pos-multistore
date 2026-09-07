const Receipt =
    require("../models/receiptModel");

/*
|--------------------------------------------------------------------------
| Get Receipt By Sale ID
|--------------------------------------------------------------------------
*/

const getReceiptBySaleId = async (
    saleId,
    storeId
) => {

    const receipt =
        await Receipt.getReceiptBySaleId(
            saleId,
            storeId
        );

    if (!receipt) {
        throw new Error("Receipt not found.");
    }

    return {

        business: {

            business_name:
                receipt.business.business_name,

            phone:
                receipt.business.phone,

            email:
                receipt.business.email,

            address:
                receipt.business.address,

            receipt_footer:
                receipt.business.receipt_footer

        },

        sale: {

            receipt_number:
                `RCP-${String(receipt.sale.id).padStart(6, "0")}`,

            sale_id:
                receipt.sale.id,

            customer_name:
                receipt.sale.customer_name,

            cashier_name:
                receipt.sale.cashier_name,

            payment_method:
                receipt.sale.payment_method,

            subtotal:
                Number(receipt.sale.subtotal),

            discount:
                Number(receipt.sale.discount),

            total:
                Number(receipt.sale.total),

            created_at:
                receipt.sale.created_at

        },

        items:
            receipt.items.map(item => ({

                product_name:
                    item.product_name,

                quantity:
                    Number(item.quantity),

                selling_price:
                    Number(item.selling_price),

                total:
                    Number(item.total)

            }))

    };

};


module.exports = {
    getReceiptBySaleId
};