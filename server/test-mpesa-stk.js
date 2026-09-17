require("dotenv").config();

const axios = require("axios");

const BASE_URL = "https://sandbox.safaricom.co.ke";

function generateTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function testSTK() {
    try {
        console.log("Getting OAuth token...");

        const credentials = Buffer
            .from(
                `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
            )
            .toString("base64");

        const tokenResponse = await axios.get(
            `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    Authorization: `Basic ${credentials}`
                },
                timeout: 15000
            }
        );

        const accessToken = tokenResponse.data.access_token;

        console.log("OAuth STATUS:", tokenResponse.status);
        console.log("Token received:", !!accessToken);

        const timestamp = generateTimestamp();

        const password = Buffer
            .from(
                `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
            )
            .toString("base64");

        console.log("Shortcode:", process.env.MPESA_SHORTCODE);
        console.log("Timestamp:", timestamp);
        console.log("Callback URL:", process.env.MPESA_CALLBACK_URL);
        console.log("Sending STK Push...");

        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: 1,
                PartyA: "254712066560",
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: "254712066560",
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: "ANNIRICH",
                TransactionDesc: "Annirich test"
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        console.log("STK STATUS:", response.status);
        console.log("STK RESPONSE:");
        console.log(response.data);

    } catch (error) {

        console.log("\n===== ERROR =====");

        console.log(
            "HTTP STATUS:",
            error.response?.status || "NONE"
        );

        console.log(
            "RESPONSE:",
            error.response?.data || "NO RESPONSE"
        );

        console.log(
            "MESSAGE:",
            error.message
        );

        console.log(
            "CODE:",
            error.code || "NONE"
        );
    }
}

testSTK();