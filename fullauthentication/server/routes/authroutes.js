import { Router } from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authControllers.js";
import userAuth from "../middleware/userauth.js";
 export const authrouter =Router();
authrouter.post('/register',register);
authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authrouter.post('/verify-account',userAuth,verifyEmail)
authrouter.get('/is-auth',userAuth,isAuthenticated)
authrouter.post('/send-resetotp',userAuth,sendResetOtp)
authrouter.post('/reset-password',userAuth,resetPassword)
