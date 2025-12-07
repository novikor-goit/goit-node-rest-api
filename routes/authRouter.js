import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);

authRouter.post(
  "/verify",
  validateBody(resendVerificationSchema),
  authControllers.resendVerificationEmail
);

authRouter.post("/login", validateBody(loginSchema), authControllers.login);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

export default authRouter;
