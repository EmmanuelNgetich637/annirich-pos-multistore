const authService = require("../services/authService");

// Register User
const register = async (req, res) => {
  try {
    const id = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const {
      storeCode,
      username,
      password
    } = req.body;

    const result = await authService.login(
      storeCode,
      username,
      password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
