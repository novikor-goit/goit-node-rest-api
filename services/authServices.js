import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET } = process.env;

async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(email, password) {
  const avatarURL = gravatar.url(email, { protocol: "https" });
  const verificationToken = uuidv4();
  const newUser = new User({ email, avatarURL, verificationToken });
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

async function updateAvatar(userId, avatarURL) {
  const user = await User.findByPk(userId);
  if (user) {
    user.avatarURL = avatarURL;
    await user.save();
  }
  return user;
}

async function findUserByVerificationToken(verificationToken) {
  return User.findOne({ where: { verificationToken } });
}

async function verifyUser(userId) {
  const user = await User.findByPk(userId);
  if (user) {
    user.verificationToken = null;
    user.verify = true;
    await user.save();
  }
  return user;
}

async function sendVerificationEmail(req, user) {
  const verificationLink = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${user.verificationToken}`;

  await sendEmail(
    user.email,
    "Verify your email",
    `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
  );
}

export default {
  findUserByEmail,
  register,
  login,
  logout,
  updateAvatar,
  findUserByVerificationToken,
  verifyUser,
  sendVerificationEmail,
};
