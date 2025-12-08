import express from "express";
import { isAuth, login, logout, registerUser, verifyEmail } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", registerUser);
router.get("/verify", verifyEmail);
router.post("/login",login );
router.post("/logout",logout );
router.get("/isAuth",isAuth );

export default router;
