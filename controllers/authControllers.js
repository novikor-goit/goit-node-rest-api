import authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const userExists = await authServices.findUserByEmail(email);
    if (userExists) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await authServices.register(email, password);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
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
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
}

export default {
  register,
  login,
  logout,
  getCurrent,
};
