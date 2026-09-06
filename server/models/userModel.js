const db = require("../config/db");

// Find user by email within a specific store
const findUserByEmail = async (email, storeId) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND store_id = ?",
    [email, storeId]
  );

  return rows[0];
};

// Find user by username within a specific store
const findUserByUsername = async (username, storeId) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ? AND store_id = ?",
    [username, storeId]
  );

  return rows[0];
};

// Create user inside a specific store
const createUser = async (user) => {
  const {
    full_name,
    username,
    email,
    password,
    role,
    store_id
  } = user;

  const [result] = await db.query(
    `INSERT INTO users
    (full_name, username, email, password, role, store_id)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      full_name,
      username,
      email,
      password,
      role,
      store_id
    ]
  );

  return result.insertId;
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser
};
