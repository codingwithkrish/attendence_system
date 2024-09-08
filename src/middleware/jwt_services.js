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
exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyAccessToken = exports.signInAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const http_errors_1 = __importDefault(require("http-errors"));
const signInAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const secret = process.env.ACCESS_TOKEN_SECRET || 'defaultSecret';
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '500s', issuer: "krishgupta.com", audience: userId.toString() }, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(http_errors_1.default.InternalServerError());
            }
            resolve(token);
        });
    });
};
exports.signInAccessToken = signInAccessToken;
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.headers["authorization"])
        return next(http_errors_1.default.Unauthorized());
    const authHeader = req.headers["authorization"];
    const beareToken = authHeader.split(/\s/);
    console.log(beareToken);
    const token = beareToken[1];
    jsonwebtoken_1.default.verify(token, (_a = process.env.ACCESS_TOKEN_SECRET) !== null && _a !== void 0 ? _a : 'defaultSecret', (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(http_errors_1.default.Unauthorized(message));
        }
        req.payload = payload;
        const user = yield userModel_js_1.default.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ error: "User not find" });
        }
        req.user = user;
        next();
    }));
});
exports.verifyAccessToken = verifyAccessToken;
const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        var _a;
        const payload = { userId };
        const secret = (_a = process.env.REFRESH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : 'defaultSecret';
        jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1y",
            issuer: "krishgupta.com", audience: userId.toString() }, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(http_errors_1.default.InternalServerError());
            }
            resolve(token);
        });
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        var _a;
        jsonwebtoken_1.default.verify(refreshToken, (_a = process.env.REFRESH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : 'defaultSecret', (err, paylod) => {
            if (err)
                return reject(http_errors_1.default.Unauthorized());
            const userId = paylod.aud;
            resolve(userId);
        });
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
