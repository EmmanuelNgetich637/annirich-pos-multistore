const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

// ==========================
// Public database test
// ==========================
router.get("/database", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime");

    res.status(200).json({
      success: true,
      message: "Database connected successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
});

// ==========================
// Protected multi-store test
// ==========================
router.get("/auth-store", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication and store context verified.",
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
    store: {
      id: req.storeId,
      code: req.user.storeCode,
    },
  });
});

module.exports = router;