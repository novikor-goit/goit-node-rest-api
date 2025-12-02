import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(email, password) {
  const newUser = new User({ email });
  await newUser.setPassword(password);
  await newUser.save();
  return newUser;
}

async function login(user) {
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  user.token = token;
  await user.save();
  return token;
}

async function logout(userId) {
  const user = await User.findByPk(userId);
  if (user) {
    user.token = null;
    await user.save();
  }
}

export default {
  findUserByEmail,
  register,
  login,
  logout,
};
