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
exports.getClassById = exports.joinClass = exports.getAllClasses = exports.createClass = void 0;
const userModel_js_1 = __importDefault(require("../../models/userModel.js"));
const classModel_js_1 = __importDefault(require("../../models/classModel.js"));
// Controller function to create a new class
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user ID from the request (assuming it's stored in req.user._id)
        const userId = req.user._id;
        // Find the user by ID
        const user = yield userModel_js_1.default.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the user is a student
        if (user.userType === "student") {
            return res.status(404).json({ message: "Not Authorized" });
        }
        // Extract class data from the request body
        const { className, description, imageUrl, classCode, attendance = [], students = [], notices = [] } = req.body;
        if (classCode.length !== 6) {
            return res.status(400).json({ message: "Class code must be 6 characters" });
        }
        //random number 
        var newclassCode = Math.floor(1000 + Math.random() * 9000);
        newclassCode += classCode;
        // Create a new instance of the Class model
        const newClass = new classModel_js_1.default({
            createdBy: userId,
            className,
            description,
            imageUrl,
            classCode: newclassCode,
            attendance,
            students,
            notices,
        });
        // Save the new class to the database
        const savedClass = yield newClass.save();
        // Respond with the created class
        res.status(201).json(savedClass);
    }
    catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createClass = createClass;
const getAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user ID from the request (assuming it's stored in req.user._id)
        const userId = req.user._id;
        // Find the user by ID
        const user = yield userModel_js_1.default.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (user.userType === "student") {
            const classes = yield classModel_js_1.default.find({ students: userId });
            return res.status(200).json({ message: "Classes Fetched", success: true, data: classes });
        }
        const classes = yield classModel_js_1.default.find({ createdBy: user });
        return res.status(200).json({ message: "Classes Fetched", success: true, data: classes });
    }
    catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getAllClasses = getAllClasses;
const joinClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_js_1.default.findById(userId);
        if (!user || !(user.userType === "student")) {
            return res.status(404).json({ message: "User not found" });
        }
        const { classCode } = req.body;
        console.log("ClassCode", classCode);
        if (!classCode) {
            return res.status(400).json({ message: "Class code is required" });
        }
        const classData = yield classModel_js_1.default.findById(classCode);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        classData.students.push(userId);
        yield classData.save();
        res.status(200).json({ message: "Successfully joined class" });
    }
    catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.joinClass = joinClass;
const getClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_js_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { classCode } = req.body;
        console.log("ClassCode", classCode);
        if (!classCode) {
            return res.status(400).json({ message: "Class code is required" });
        }
        const classData = yield classModel_js_1.default.findById(classCode).populate({
            path: "createdBy",
            select: "-password" // Exclude the password field
        });
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ success: true, message: "Successfully fetched class", data: classData });
    }
    catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getClassById = getClassById;
