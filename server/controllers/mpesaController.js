const mpesaService = require("../services/mpesaService");
const Mpesa = require("../models/mpesaModel");
const Sale = require("../models/saleModel");


function getSafaricomErrorMessage(error) {

    return (
        error.response?.data?.errorMessage ||
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        error.message ||
        "M-Pesa request failed."
    );

}


/*
 * Convert Safaricom transaction date:
 *
 * 20260913171925
 *
 * into MySQL DATETIME:
 *
 * 2026-09-13 17:19:25
 */
function formatMpesaTransactionDate(value) {

    if (!value) {
        return null;
    }


    const stringValue = String(value);


    if (!/^\d{14}$/.test(stringValue)) {
        return null;
    }


    return (
        `${stringValue.slice(0, 4)}-` +
        `${stringValue.slice(4, 6)}-` +
        `${stringValue.slice(6, 8)} ` +
        `${stringValue.slice(8, 10)}:` +
        `${stringValue.slice(10, 12)}:` +
        `${stringValue.slice(12, 14)}`
    );

}


/*
 * INITIATE M-PESA STK PUSH
 */
const initiatePayment = async (req, res) => {

    try {

        const storeId = req.storeId;


        if (!storeId) {

            return res.status(401).json({

                success: false,

                message:
                    "Store authentication required.",

            });

        }


        const {
            saleId,
            phoneNumber,
        } = req.body;


        if (!saleId || !phoneNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "saleId and phoneNumber are required.",

            });

        }


        /*
         * Get sale using authenticated store.
         *
         * This prevents Store B from initiating
         * payment against Store A's sale.
         */
        const sale =
            await Sale.getSaleById(
                saleId,
                storeId
            );


        if (!sale) {

            return res.status(404).json({

                success: false,

                message:
                    "Sale not found.",

            });

        }


        /*
         * This sale must be an M-Pesa sale.
         */
        if (sale.payment_method !== "Mpesa") {

            return res.status(400).json({

                success: false,

                message:
                    `Sale payment method is ${sale.payment_method || "not set"}, not Mpesa.`,

            });

        }


        /*
         * Prevent starting another STK Push
         * for an already-paid sale.
         */
        if (sale.payment_status === "paid") {

            return res.status(400).json({

                success: false,

                message:
                    "This sale has already been paid.",

            });

        }


        /*
         * IMPORTANT:
         *
         * Never trust amount supplied by the frontend.
         *
         * The database sale total is authoritative.
         */
        const amount =
            Number(sale.total);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Sale has an invalid total amount.",

            });

        }


        /*
         * Daraja STK Push expects
         * an integer amount.
         */
        const mpesaAmount =
            Math.round(amount);


        if (mpesaAmount <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Sale amount must be greater than zero.",

            });

        }


        /*
         * Normalize Kenyan phone number.
         */
        const normalizedPhone =
            mpesaService.normalizePhoneNumber(
                phoneNumber
            );


        /*
         * Initiate STK Push.
         */
        const stkResponse =
            await mpesaService.initiateSTKPush({

                amount:
                    mpesaAmount,

                phoneNumber:
                    normalizedPhone,

                accountReference:
                    `SALE-${sale.id}`,

                transactionDesc:
                    `Payment for Sale ${sale.id}`,

            });


        const responseCode =
            String(
                stkResponse.ResponseCode ?? ""
            );


        /*
         * ResponseCode 0 means Safaricom
         * accepted the STK request.
         *
         * It does NOT yet mean the customer paid.
         */
        const status =
            responseCode === "0"
                ? "pending"
                : "failed";


        /*
         * Store the M-Pesa transaction.
         */
        const transactionId =
            await Mpesa.createTransaction({

                store_id:
                    storeId,

                sale_id:
                    sale.id,

                merchant_request_id:
                    stkResponse.MerchantRequestID ||
                    null,

                checkout_request_id:
                    stkResponse.CheckoutRequestID ||
                    null,

                phone_number:
                    normalizedPhone,

                amount:
                    mpesaAmount,

                status,

            });


        /*
         * If Safaricom rejected the STK request,
         * mark the sale as failed too.
         */
        if (responseCode !== "0") {

            await Sale.updatePaymentStatus(

                sale.id,

                storeId,

                "failed"

            );

        }


        return res.status(200).json({

            success: true,

            message:
                responseCode === "0"
                    ? "STK Push sent successfully."
                    : "STK Push request was rejected.",

            data: {

                transactionId,

                saleId:
                    sale.id,

                amount:
                    mpesaAmount,

                phoneNumber:
                    normalizedPhone,

                merchantRequestId:
                    stkResponse.MerchantRequestID ||
                    null,

                checkoutRequestId:
                    stkResponse.CheckoutRequestID ||
                    null,

                responseCode,

                responseDescription:
                    stkResponse.ResponseDescription ||
                    null,

                customerMessage:
                    stkResponse.CustomerMessage ||
                    null,

                status,

            },

        });

    } catch (error) {

        console.error(
            "M-Pesa STK Push error:",
            error.response?.data ||
            error.message
        );


        const message =
            getSafaricomErrorMessage(
                error
            );


        return res.status(500).json({

            success: false,

            message,

        });

    }

};


/*
 * SAFARICOM CALLBACK
 *
 * This endpoint is intentionally public.
 * Safaricom calls it without our JWT.
 */
const callback = async (req, res) => {

    try {

        const callbackData =
            req.body?.Body?.stkCallback;


        /*
         * Always acknowledge malformed callbacks.
         */
        if (!callbackData) {

            console.error(
                "Invalid M-Pesa callback payload."
            );


            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata,
        } = callbackData;


        if (!CheckoutRequestID) {

            console.error(
                "M-Pesa callback missing CheckoutRequestID."
            );


            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        /*
         * Find our pending transaction.
         *
         * CheckoutRequestID comes from Safaricom,
         * but the transaction itself determines
         * the store and sale.
         */
        const transaction =
            await Mpesa.findByCheckoutRequestId(
                CheckoutRequestID
            );


        if (!transaction) {

            console.error(
                "M-Pesa callback transaction not found:",
                CheckoutRequestID
            );


            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        /*
         * Idempotency.
         *
         * If Safaricom sends the callback again,
         * don't process the payment twice.
         */
        if (
            transaction.status === "completed" ||
            transaction.status === "failed" ||
            transaction.status === "cancelled"
        ) {

            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        /*
         * FAILED / CANCELLED PAYMENT
         */
        if (Number(ResultCode) !== 0) {

            /*
             * Update M-Pesa transaction.
             */
            await Mpesa.updateTransaction(

                transaction.id,

                {

                    result_code:
                        Number(ResultCode),

                    result_desc:
                        ResultDesc ||
                        null,

                    status:
                        "failed",

                }

            );


            /*
             * Update corresponding sale.
             */
            if (transaction.sale_id) {

                await Sale.updatePaymentStatus(

                    transaction.sale_id,

                    transaction.store_id,

                    "failed"

                );

            }


            console.log(
                `M-Pesa payment failed. Transaction ${transaction.id}, Sale ${transaction.sale_id}: ${ResultDesc}`
            );


            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        /*
         * SUCCESSFUL PAYMENT
         *
         * Extract callback metadata.
         */
        const metadata = {};


        if (
            Array.isArray(
                CallbackMetadata?.Item
            )
        ) {

            for (
                const item
                of CallbackMetadata.Item
            ) {

                metadata[item.Name] =
                    item.Value;

            }

        }


        /*
         * Extract important payment values.
         */
        const callbackAmount =
            Number(
                metadata.Amount
            );


        const callbackPhone =
            metadata.PhoneNumber
                ? String(
                    metadata.PhoneNumber
                )
                : null;


        const receiptNumber =
            metadata.MpesaReceiptNumber
                ? String(
                    metadata.MpesaReceiptNumber
                )
                : null;


        const transactionDate =
            formatMpesaTransactionDate(
                metadata.TransactionDate
            );


        /*
         * Verify amount.
         *
         * Never mark a transaction completed
         * if Safaricom's callback amount does not
         * match what we requested.
         */
        if (
            !Number.isFinite(
                callbackAmount
            ) ||
            callbackAmount !==
                Number(transaction.amount)
        ) {

            console.error(
                "M-Pesa callback amount mismatch:",
                {
                    transactionId:
                        transaction.id,

                    expected:
                        transaction.amount,

                    received:
                        callbackAmount,
                }
            );


            /*
             * Mark M-Pesa transaction failed.
             */
            await Mpesa.updateTransaction(

                transaction.id,

                {

                    result_code:
                        Number(ResultCode),

                    result_desc:
                        "Callback amount does not match transaction amount.",

                    status:
                        "failed",

                }

            );


            /*
             * Mark sale failed.
             */
            if (transaction.sale_id) {

                await Sale.updatePaymentStatus(

                    transaction.sale_id,

                    transaction.store_id,

                    "failed"

                );

            }


            return res.status(200).json({

                ResultCode: 0,

                ResultDesc:
                    "Accepted",

            });

        }


        /*
         * Verify phone number when Safaricom
         * provides it.
         */
        if (callbackPhone) {

            const normalizedCallbackPhone =
                mpesaService.normalizePhoneNumber(
                    callbackPhone
                );


            if (
                normalizedCallbackPhone !==
                transaction.phone_number
            ) {

                console.error(
                    "M-Pesa callback phone mismatch:",
                    {
                        transactionId:
                            transaction.id,

                        expected:
                            transaction.phone_number,

                        received:
                            normalizedCallbackPhone,
                    }
                );


                /*
                 * Mark M-Pesa transaction failed.
                 */
                await Mpesa.updateTransaction(

                    transaction.id,

                    {

                        result_code:
                            Number(ResultCode),

                        result_desc:
                            "Callback phone number does not match transaction phone number.",

                        status:
                            "failed",

                    }

                );


                /*
                 * Mark sale failed.
                 */
                if (transaction.sale_id) {

                    await Sale.updatePaymentStatus(

                        transaction.sale_id,

                        transaction.store_id,

                        "failed"

                    );

                }


                return res.status(200).json({

                    ResultCode: 0,

                    ResultDesc:
                        "Accepted",

                });

            }

        }


        /*
         * Successful and verified payment.
         *
         * First update the sale status.
         */
        if (transaction.sale_id) {

            const saleUpdated =
                await Sale.updatePaymentStatus(

                    transaction.sale_id,

                    transaction.store_id,

                    "paid"

                );


            if (!saleUpdated) {

                console.error(
                    `M-Pesa payment received but sale ${transaction.sale_id} could not be updated.`
                );


                /*
                 * Do not mark the M-Pesa transaction
                 * completed if the corresponding sale
                 * cannot be updated.
                 */
                return res.status(500).json({

                    ResultCode: 1,

                    ResultDesc:
                        "Sale payment status update failed.",

                });

            }

        }


        /*
         * Now mark the M-Pesa transaction
         * as completed.
         */
        await Mpesa.updateTransaction(

            transaction.id,

            {

                mpesa_receipt_number:
                    receiptNumber,

                transaction_date:
                    transactionDate,

                result_code:
                    Number(ResultCode),

                result_desc:
                    ResultDesc ||
                    null,

                status:
                    "completed",

            }

        );


        console.log(
            `M-Pesa payment completed. Transaction ${transaction.id}, Sale ${transaction.sale_id}, Receipt ${receiptNumber}`
        );


        /*
         * Safaricom expects a successful
         * acknowledgement.
         */
        return res.status(200).json({

            ResultCode: 0,

            ResultDesc:
                "Accepted",

        });

    } catch (error) {

        console.error(
            "M-Pesa callback error:",
            error.message
        );


        /*
         * Safaricom expects an acknowledgement.
         *
         * We intentionally don't expose internal
         * errors in the callback response.
         */
        return res.status(200).json({

            ResultCode: 0,

            ResultDesc:
                "Accepted",

        });

    }

};


/*
 * GET ONE TRANSACTION
 */
const getTransaction = async (
    req,
    res
) => {

    try {

        const transaction =
            await Mpesa.findById(

                req.params.id,

                req.storeId

            );


        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "M-Pesa transaction not found.",

            });

        }


        return res.json({

            success: true,

            data:
                transaction,

        });

    } catch (error) {

        console.error(
            "Get M-Pesa transaction error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to retrieve M-Pesa transaction.",

        });

    }

};


/*
 * GET STORE TRANSACTIONS
 */
const getStoreTransactions = async (
    req,
    res
) => {

    try {

        const transactions =
            await Mpesa.listByStore(
                req.storeId
            );


        return res.json({

            success: true,

            count:
                transactions.length,

            data:
                transactions,

        });

    } catch (error) {

        console.error(
            "Get M-Pesa transactions error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to retrieve M-Pesa transactions.",

        });

    }

};


module.exports = {

    initiatePayment,

    callback,

    getTransaction,

    getStoreTransactions,

};