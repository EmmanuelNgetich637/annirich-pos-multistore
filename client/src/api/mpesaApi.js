import api from "./axios";

export const initiateMpesaPayment = async ({
    saleId,
    phoneNumber
}) => {
    const response = await api.post(
        "/mpesa/stkpush",
        {
            saleId,
            phoneNumber
        }
    );

    return response.data;
};

export const getMpesaTransaction = async (id) => {
    const response = await api.get(
        `/mpesa/transactions/${id}`
    );

    return response.data;
};

export const getMpesaTransactions = async () => {
    const response = await api.get(
        "/mpesa/transactions"
    );

    return response.data;
};
