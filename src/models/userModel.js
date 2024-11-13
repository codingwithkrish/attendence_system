"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['teacher', 'student', 'admin'],
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female", "other"]
    },
    phone: {
        type: String,
        required: false,
    },
    uniqueRollId: {
        type: String,
        required: true,
    },
    notificationToken: {
        type: String,
        required: false,
    },
    images: [
        {
            type: String,
            default: []
        }
    ]
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('User', userSchema);
