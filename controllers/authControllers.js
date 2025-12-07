import authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import path from "path";
import fs from "fs/promises";
import sendEmail from "../helpers/sendEmail.js";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const userExists = await authServices.findUserByEmail(email);
    if (userExists) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await authServices.register(email, password);
    await authServices.sendVerificationEmail(req, newUser);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await authServices.findUserByEmail(email);
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const token = await authServices.login(user);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authServices.logout(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getCurrent(req, res, next) {
  const { email, subscription, avatarURL } = req.user;
  res.json({
    email,
    subscription,
    avatarURL,
  });
}

async function updateAvatar(req, res, next) {
  try {
    const { id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const avatarsDir = path.resolve("public", "avatars");
    const extension = path.extname(originalname);
    const filename = `${id}${extension}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await authServices.updateAvatar(id, avatarURL);
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  try {
    const user =
      await authServices.findUserByVerificationToken(verificationToken);
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await authServices.verifyUser(user.id);
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  const { email } = req.body;
  try {
    const user = await authServices.findUserByEmail(email);
    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await authServices.sendVerificationEmail(req, user);

    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};
