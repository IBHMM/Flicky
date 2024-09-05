import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getUser,
  SendCode,
  VerifyCode,
  ResetPassword,
} from "../../controller/user/auth/user.controller.mjs";
import { verifyJWT } from "../../middleware/User/auth.middleware.mjs";
import { subscribe } from "../../controller/user/user/index.mjs";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/forget/getcode").post(SendCode);
router.route("/forget/verify").post(VerifyCode);
router.route("/forget/reset_password").post(ResetPassword);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/getuser").get(verifyJWT, getUser)

router.route("/subscribe").post(verifyJWT, subscribe)

export default router;