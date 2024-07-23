"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/send-otp', userController_1.sendOtp);
router.post('/verify-otp', userController_1.verifyOtp);
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.post('/refresh-token', userController_1.refreshToken);
exports.default = router;
