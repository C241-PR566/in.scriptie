import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import conn from "../services/storeData.js";
import crypto from "crypto";

async function registerUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password cannot be empty",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  const userData = {
    id,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  try {
    const checkEmail = "SELECT * FROM users WHERE email = ?";
    const emailResults = await new Promise((resolve, reject) => {
      conn.query(checkEmail, [email], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    if (emailResults.length > 0) {
      return res.status(409).json({
        status: "fail",
        message: "Email is already registered",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "fail",
        message: "Password must contain at least 8 characters",
      });
    }
    const insertUser =
      "INSERT INTO users (id, email, password, createdAt) VALUES (?, ?, ?, ?)";
    await new Promise((resolve, reject) => {
      conn.query(
        insertUser,
        [id, email, hashedPassword, userData.createdAt],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Gagal menyimpan data pengguna: ${error.message}`,
    });
  }

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: userData,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const users = "SELECT * FROM users WHERE email = ?";
    const userResults = await new Promise((resolve, reject) => {
      conn.query(users, [email], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    if (userResults.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const user = userResults[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Server error: ${error.message}`,
    });
  }
}

export { registerUser, loginUser };
