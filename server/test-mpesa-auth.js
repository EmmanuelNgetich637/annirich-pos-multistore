require("dotenv").config();

const axios = require("axios");

const key = process.env.MPESA_CONSUMER_KEY;
const secret = process.env.MPESA_CONSUMER_SECRET;

console.log("Environment:", process.env.MPESA_ENV);
console.log("Consumer key loaded:", !!key);
console.log("Consumer secret loaded:", !!secret);
console.log("Shortcode:", process.env.MPESA_SHORTCODE);

if (!key || !secret) {
    console.log("ERROR: Consumer credentials are missing.");
    process.exit(1);
}

const credentials = Buffer
    .from(`${key}:${secret}`)
    .toString("base64");

axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
        headers: {
            Authorization: `Basic ${credentials}`
        },
        timeout: 15000
    }
)
.then(response => {

    console.log("STATUS:", response.status);
    console.log(
        "TOKEN RECEIVED:",
        !!response.data?.access_token
    );
    console.log(
        "EXPIRES IN:",
        response.data?.expires_in
    );

})
.catch(error => {

    console.log(
        "STATUS:",
        error.response?.status || "NO HTTP STATUS"
    );

    console.log(
        "ERROR:",
        error.response?.data || error.message
    );

});
