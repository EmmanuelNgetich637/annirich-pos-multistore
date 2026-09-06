const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../models/userModel");

// Find an active store by store code
const findStoreByCode = async (storeCode) => {
  const [rows] = await db.query(
    `SELECT id, name, code, status
     FROM stores
     WHERE code = ?`,
    [storeCode]
  );

  return rows[0];
};

// Register User
const register = async (data) => {
  const { storeCode } = data;

  // Find store
  const store = await findStoreByCode(storeCode);

  if (!store) {
    throw new Error("Invalid store code");
  }

  if (store.status !== "active") {
    throw new Error("This store is inactive");
  }

  // Check if email already exists in this store
  const existingUser = await User.findUserByEmail(
    data.email,
    store.id
  );

  if (existingUser) {
    throw new Error("Email already exists in this store");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user inside the store
  const userId = await User.createUser({
    ...data,
    password: hashedPassword,
    store_id: store.id,
  });

  return userId;
};

// Login User
const login = async (storeCode, username, password) => {
  // Find store
  const store = await findStoreByCode(storeCode);

  if (!store || store.status !== "active") {
    throw new Error("Invalid store code");
  }

  // Find user inside this store
  const user = await User.findUserByUsername(
    username,
    store.id
  );

  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Check user status
  if (user.status !== "active") {
    throw new Error("User account is inactive");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      storeId: store.id,
      storeCode: store.code,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
      storeId: store.id,
      storeCode: store.code,
      storeName: store.name,
    },
  };
};

module.exports = {
  register,
  login,
};
