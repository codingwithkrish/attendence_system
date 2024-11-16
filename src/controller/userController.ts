import User from '../models/userModel';
import Otp from '../models/otpModel';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { signInAccessToken, signRefreshToken, verifyRefreshToken } from '../middleware/jwt_services';

import nodemailer from 'nodemailer';
export const sendOtp = async (req: any, res: any) => {
    try {
        const {email} = req.body;
        if (!email||!email.includes("@vupune.ac.in")) {
            return res.status(422).json({ message: "Email is required or Email not eligible",success:false });
        }
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otp = new Otp({ email, otp: OTP });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const reuslt=await otp.save();
        console.log(reuslt)
        //send otp to email
        const mail = {
            from:"VU Pune",
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
        }
         const contactEmail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    contactEmail.verify((error) => {
        if (error) {
       return res.status(500).json({ message: "Unable to send otp",success:false,error:error.message });
        } else {
            console.log("Ready to Send");
        }
    });
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            console.log(error)
       return res.status(500).json({ message: "Unable to send otp",success:false,error:error.message });
        } else {
        return res.status(200).json({ message: "OTP sent successfully",success:true });
        }
    });
    } catch (error) {
        console.log(error)
       return res.status(500).json({ message: "Unable to send otp",success:false,error:error });

    }
}
export const verifyOtp = async (req: any, res: any) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(422).json({ message: "Email and OTP is required",success:false });
        }
        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return res.status(422).json({ message: "Invalid OTP",success:false });
        }
        const isValid = await bcrypt.compare(otp, otpData.otp);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid OTP",success:false });
        }
        await Otp.deleteOne({ email });
        return res.status(200).json({ message: "OTP verified successfully",success:true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Unable to verify otp",success:false,error:error });
    }
}
export const register = async (req: any, res: any) => {
    try {
        const { email, password,name,userType,gender,uniqueRollId,notificationToken,images } = req.body;
        if (!email || !password || !name || !userType || !gender || !uniqueRollId||!notificationToken||!images) {
            return res.status(422).json({ message: "Neccesary Fields are required",success:false });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(422).json({ message: "User already exists",success:false });
        }
        user = new User({userType,name,email,password,uniqueRollId,gender,notificationToken,images});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return res.status(200).json({ message: "User registered successfully.Please Login",success:true,data:{userId:user.id} });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Unable to register user",success:false,error:error });
    }   
}
export const login = async (req: any, res: any) => {
    try {
        const { email, password,notificationToken } = req.body;
        if (!email || !password) {
            return res.status(422).json({ message: "Email and Password is required",success:false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(422).json({ message: "Invalid Credentials",success:false });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid Credentials",success:false });
        }
         const accessToken = await signInAccessToken(user.id);
        const refreshToken =await signRefreshToken(user.id);
        const newUserUpdate = await User.findOneAndUpdate({
            email: email
        }, {
            notificationToken: notificationToken
        }, {
            returnOriginal: false
        });
        return res.status(200).json({ message: "User logged in successfully",success:true,user: {
                name: user.name,
                email: user.email,
               userType:user.userType,
                userId: user._id,
                notificationToken: notificationToken,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Unable to login user",success:false,error:error });
    }
}
export const refreshToken = async (req:any, res:any, next:any) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId:String = await verifyRefreshToken(refreshToken);
        const accessToken = await signInAccessToken(userId);
        const refreshToken1 = await signRefreshToken(userId);
        res.send({ accessToken, refreshToken: refreshToken1 });
    } catch (error) {
        next(error);
    }
};
