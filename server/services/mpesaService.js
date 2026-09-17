const axios = require("axios");

const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

const BASE_URL =
    MPESA_ENV === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Get OAuth access token from Safaricom Daraja.
 */
async function getAccessToken() {
    const now = Date.now();

    if (cachedAccessToken && now < tokenExpiresAt) {
        console.log("M-Pesa OAuth: using cached access token");
        return cachedAccessToken;
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error(
            "M-Pesa consumer credentials are not configured."
        );
    }

    const credentials = Buffer
        .from(`${consumerKey}:${consumerSecret}`)
        .toString("base64");

    console.log("M-Pesa OAuth: requesting fresh access token...");

    const response = await axios.get(
        `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
            timeout: 15000,
        }
    );

    if (!response.data?.access_token) {
        throw new Error(
            "M-Pesa access token was not returned."
        );
    }

    cachedAccessToken = response.data.access_token;

    const expiresIn = Number(
        response.data.expires_in || 3599
    );

    tokenExpiresAt =
        now +
        Math.max(expiresIn - 60, 60) * 1000;

    console.log(
        "M-Pesa OAuth: access token received successfully."
    );

    return cachedAccessToken;
}

/**
 * Generate the STK Push password.
 */
function generatePassword(timestamp) {
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    if (!shortcode || !passkey) {
        throw new Error(
            "M-Pesa shortcode/passkey are not configured."
        );
    }

    return Buffer
        .from(
            `${shortcode}${passkey}${timestamp}`
        )
        .toString("base64");
}

/**
 * Generate Daraja timestamp.
 */
function generateTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    const hours = String(
        now.getHours()
    ).padStart(2, "0");

    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
        now.getSeconds()
    ).padStart(2, "0");

    return (
        `${year}${month}${day}` +
        `${hours}${minutes}${seconds}`
    );
}

/**
 * Normalize Kenyan phone numbers.
 *
 * Examples:
 * 0712345678   -> 254712345678
 * 0112345678   -> 254112345678
 * +254712345678 -> 254712345678
 * 254712345678 -> 254712345678
 */
function normalizePhoneNumber(phone) {
    if (!phone) {
        throw new Error(
            "Phone number is required."
        );
    }

    let normalized = String(phone).trim();

    normalized = normalized.replace(
        /\s+/g,
        ""
    );

    if (normalized.startsWith("+")) {
        normalized =
            normalized.substring(1);
    }

    if (/^07\d{8}$/.test(normalized)) {
        normalized =
            `254${normalized.substring(1)}`;
    } else if (/^01\d{8}$/.test(normalized)) {
        normalized =
            `254${normalized.substring(1)}`;
    }

    if (!/^254\d{9}$/.test(normalized)) {
        throw new Error(
            "Invalid Kenyan phone number."
        );
    }

    return normalized;
}

/**
 * Initiate M-Pesa STK Push.
 */
async function initiateSTKPush({
    amount,
    phoneNumber,
    accountReference,
    transactionDesc,
}) {
    try {
        const accessToken =
            await getAccessToken();

        const timestamp =
            generateTimestamp();

        const password =
            generatePassword(timestamp);

        const shortcode =
            process.env.MPESA_SHORTCODE;

        const callbackUrl =
            process.env.MPESA_CALLBACK_URL;

        if (!callbackUrl) {
            throw new Error(
                "M-Pesa callback URL is not configured."
            );
        }

        const phone =
            normalizePhoneNumber(
                phoneNumber
            );

        const numericAmount =
            Number(amount);

        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {
            throw new Error(
                "Invalid M-Pesa amount."
            );
        }

        const payload = {
            BusinessShortCode:
                shortcode,

            Password:
                password,

            Timestamp:
                timestamp,

            TransactionType:
                "CustomerPayBillOnline",

            Amount:
                Math.round(
                    numericAmount
                ),

            PartyA:
                phone,

            PartyB:
                shortcode,

            PhoneNumber:
                phone,

            CallBackURL:
                callbackUrl,

            AccountReference:
                String(
                    accountReference ||
                    "ANNIRICH"
                ),

            TransactionDesc:
                String(
                    transactionDesc ||
                    "Annirich POS payment"
                ),
        };

        console.log(
            "===== M-PESA STK DEBUG ====="
        );

        console.log(
            "Environment:",
            MPESA_ENV
        );

        console.log(
            "Base URL:",
            BASE_URL
        );

        console.log(
            "STK URL:",
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`
        );

        console.log(
            "Shortcode:",
            shortcode
        );

        console.log(
            "Amount:",
            payload.Amount
        );

        console.log(
            "Phone:",
            phone
        );

        console.log(
            "Timestamp:",
            timestamp
        );

        console.log(
            "Callback URL:",
            callbackUrl
        );

        console.log(
            "Access token loaded:",
            !!accessToken
        );

        console.log(
            "Payload:",
            {
                ...payload,
                Password: "[HIDDEN]",
            }
        );

        console.log(
            "============================"
        );

        const response =
            await axios.post(
                `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
                payload,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,

                        "Content-Type":
                            "application/json",
                    },

                    timeout: 30000,
                }
            );

        console.log(
            "===== M-PESA SUCCESS ====="
        );

        console.log(
            "HTTP Status:",
            response.status
        );

        console.log(
            "Response:",
            response.data
        );

        console.log(
            "=========================="
        );

        return response.data;

    } catch (error) {

        console.log(
            "===== M-PESA ERROR ====="
        );

        console.log(
            "Message:",
            error.message
        );

        console.log(
            "Code:",
            error.code || "NONE"
        );

        console.log(
            "HTTP Status:",
            error.response?.status ||
            "NONE"
        );

        console.log(
            "Safaricom Response:",
            error.response?.data ||
            "NO RESPONSE"
        );

        console.log(
            "Request URL:",
            error.config?.url ||
            "UNKNOWN"
        );

        console.log(
            "========================"
        );

        throw error;
    }
}

module.exports = {
    getAccessToken,
    initiateSTKPush,
    normalizePhoneNumber,
};