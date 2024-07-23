import express from 'express';
import { sendOtp,verifyOtp,register,login,refreshToken } from '../controller/userController';
const router = express.Router();
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
export default router;