const express = require("express");

const router = express.Router();

const mpesaController = require("../controllers/mpesaController");
const authenticate = require("../middleware/authMiddleware");

// Safaricom callback
// This endpoint must NOT use JWT authentication.
router.post(
    "/callback",
    mpesaController.callback
);

// Initiate STK Push
router.post(
    "/stkpush",
    authenticate,
    mpesaController.initiatePayment
);

// Get all M-Pesa transactions for authenticated store
router.get(
    "/transactions",
    authenticate,
    mpesaController.getStoreTransactions
);

// Get one M-Pesa transaction for authenticated store
router.get(
    "/transactions/:id",
    authenticate,
    mpesaController.getTransaction
);

module.exports = router;