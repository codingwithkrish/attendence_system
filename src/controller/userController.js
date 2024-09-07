"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = exports.verifyOtp = exports.sendOtp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_services_1 = require("../middleware/jwt_services");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email || !email.includes("@vupune.ac.in")) {
            return res.status(422).json({ message: "Email is required or Email not eligible", success: false });
        }
        const OTP = otp_generator_1.default.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otp = new otpModel_1.default({ email, otp: OTP });
        const salt = yield bcryptjs_1.default.genSalt(10);
        otp.otp = yield bcryptjs_1.default.hash(otp.otp, salt);
        const reuslt = yield otp.save();
        console.log(reuslt);
        //send otp to email
        const mail = {
            from: "VU Pune",
            to: email,
            subject: "OTP for verification",
            html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px; color: #ffffff;"
                  >12 Nov, 2021</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${email},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for choosing VU PUNE. Use the following OTP
              to complete the procedure to verify your email address. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
              Do not share this code with others, including VU Pune
              employees.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
        ${OTP}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            href="mailto:202101521@vupune.ac.in"
            style="color: #499fb6; text-decoration: none;"
            >202101521@vupune.ac.in</a
          >
          or visit our
          <a
            href=""
            target="_blank"
            style="color: #499fb6; text-decoration: none;"
            >Help Center</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Krish Gupta
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">
          Address VU Pune.
        </p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href=""
            target="_blank"
            style="display: inline-block; margin-left: 8px;"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">
          Copyright © 2022 Company. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`
        };
        const contactEmail = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        contactEmail.verify((error) => {
            if (error) {
                return res.status(500).json({ message: "Unable to send otp", success: false, error: error.message });
            }
            else {
                console.log("Ready to Send");
            }
        });
        contactEmail.sendMail(mail, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Unable to send otp", success: false, error: error.message });
            }
            else {
                return res.status(200).json({ message: "OTP sent successfully", success: true });
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to send otp", success: false, error: error });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(422).json({ message: "Email and OTP is required", success: false });
        }
        const otpData = yield otpModel_1.default.findOne({ email });
        if (!otpData) {
            return res.status(422).json({ message: "Invalid OTP", success: false });
        }
        const isValid = yield bcryptjs_1.default.compare(otp, otpData.otp);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid OTP", success: false });
        }
        yield otpModel_1.default.deleteOne({ email });
        return res.status(200).json({ message: "OTP verified successfully", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to verify otp", success: false, error: error });
    }
});
exports.verifyOtp = verifyOtp;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, userType, gender, uniqueRollId, notificationToken, images } = req.body;
        if (!email || !password || !name || !userType || !gender || !uniqueRollId || !notificationToken || !images) {
            return res.status(422).json({ message: "Neccesary Fields are required", success: false });
        }
        let user = yield userModel_1.default.findOne({ email });
        if (user) {
            return res.status(422).json({ message: "User already exists", success: false });
        }
        user = new userModel_1.default({ userType, name, email, password, uniqueRollId, gender, notificationToken, images });
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(user.password, salt);
        yield user.save();
        return res.status(200).json({ message: "User registered successfully.Please Login", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to register user", success: false, error: error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, notificationToken } = req.body;
        if (!email || !password) {
            return res.status(422).json({ message: "Email and Password is required", success: false });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(422).json({ message: "Invalid Credentials", success: false });
        }
        const isValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid Credentials", success: false });
        }
        const accessToken = yield (0, jwt_services_1.signInAccessToken)(user.id);
        const refreshToken = yield (0, jwt_services_1.signRefreshToken)(user.id);
        const newUserUpdate = yield userModel_1.default.findOneAndUpdate({
            email: email
        }, {
            notificationToken: notificationToken
        }, {
            returnOriginal: false
        });
        return res.status(200).json({ message: "User logged in successfully", success: true, user: {
                name: user.name,
                email: user.email,
                userId: user._id,
                notificationToken: notificationToken,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to login user", success: false, error: error });
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw http_errors_1.default.BadRequest();
        const userId = yield (0, jwt_services_1.verifyRefreshToken)(refreshToken);
        const accessToken = yield (0, jwt_services_1.signInAccessToken)(userId);
        const refreshToken1 = yield (0, jwt_services_1.signRefreshToken)(userId);
        res.send({ accessToken, refreshToken: refreshToken1 });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
