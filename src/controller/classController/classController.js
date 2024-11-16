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
exports.verifyLocations = exports.startAttendance = exports.getStudents = exports.getClassById = exports.joinClass = exports.getAllClasses = exports.createClass = void 0;
const userModel_js_1 = __importDefault(require("../../models/userModel.js"));
const classModel_js_1 = __importDefault(require("../../models/classModel.js"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const attendenModel_js_1 = __importDefault(require("../../models/attendenModel.js"));
const locationModel_js_1 = __importDefault(require("../../models/locationModel.js"));
const geolib_1 = require("geolib");
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
        const { className, description, imageUrl, classCode, attendance = [], students = [], notices = [], } = req.body;
        if (classCode.length !== 6) {
            return res
                .status(400)
                .json({ message: "Class code must be 6 characters" });
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
            return res
                .status(404)
                .json({ message: "User not found", success: false });
        }
        if (user.userType === "student") {
            const classes = yield classModel_js_1.default.find({ students: userId });
            return res
                .status(200)
                .json({ message: "Classes Fetched", success: true, data: classes });
        }
        const classes = yield classModel_js_1.default.find({ createdBy: user });
        return res
            .status(200)
            .json({ message: "Classes Fetched", success: true, data: classes });
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
            select: "-password", // Exclude the password field
        });
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({
            success: true,
            message: "Successfully fetched class",
            data: classData,
        });
    }
    catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getClassById = getClassById;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: {
                path: "students",
                select: "name email",
            },
        };
        const result = yield classModel_js_1.default.paginate({ _id: classId }, options);
        const students = result.docs.flatMap((doc) => doc.students);
        return res.status(200).json({
            success: true,
            data: {
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
                docs: students,
            },
            message: "Students fetched successfully",
        });
    }
    catch (error) {
        console.error("Error getting students:", error);
        return res.status(500).json({
            error: "Error getting students",
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getStudents = getStudents;
// Initialize Socket.IO (assuming you have an Express server)
const startAttendance = (io) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_js_1.default.findById(userId);
        // Check if user is a teacher
        if (!user || user.userType !== "teacher") {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: "User not found",
            });
        }
        const { classId, lat, long, radius, time, address } = req.body;
        if (!classId || !lat || !long || !radius || !time || !address) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false,
                error: "Missing required fields",
            });
        }
        const classData = yield classModel_js_1.default.findById(classId);
        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
                success: false,
                error: "Class not found",
            });
        }
        if (classData.createdBy.toString() !== userId.toString()) {
            return res.status(401).json({
                message: "Not Authorized",
                success: false,
                error: "Not Authorized",
            });
        }
        const existingAttendance = yield attendenModel_js_1.default.findOne({
            classId,
            isLive: true,
        });
        if (existingAttendance) {
            return res.status(200).json({
                message: "Attendance session already in progress",
                success: true,
                data: existingAttendance,
            });
        }
        const OTP = otp_generator_1.default.generate(4, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });
        const newLocation = new locationModel_js_1.default({
            coordinates: {
                type: "Point",
                coordinates: [long, lat],
            },
            address,
        });
        yield newLocation.save();
        const newAttendance = new attendenModel_js_1.default({
            classId,
            timer: time,
            locationRadius: radius,
            otp: OTP,
            location: newLocation._id,
            isLive: true,
            startTime: new Date(), // Add start time to track elapsed time
        });
        yield newAttendance.save();
        classData.attendance.push(newAttendance._id);
        yield classData.save();
        const classSocket = io.of(`/attendance/${classId}`);
        const startTime = Date.now();
        classSocket.on("connection", (socket) => {
            console.log(`New student connected for class ${classId}`);
            // Calculate remaining time for the new connection
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = Math.max(time - elapsed, 0);
            // Emit the current remaining time to the newly connected user
            socket.emit("attendanceStarted", {
                message: "Attendance started",
                OTP,
                timeLeft: remainingTime,
            });
            // Countdown timer
            const countdownInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = Math.max(time - elapsed, 0);
                socket.emit("countdown", { timeLeft: remainingTime });
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                    socket.emit("attendanceEnded", {
                        message: "Attendance session ended",
                    });
                    classSocket.disconnectSockets();
                    newAttendance.isLive = false;
                    yield newAttendance.save();
                }
            }), 1000);
            socket.on("disconnect", () => {
                console.log(`Student disconnected from class ${classId}`);
            });
        });
        return res.status(200).json({
            message: "Attendance started",
            success: true,
            data: newAttendance,
        });
    }
    catch (error) {
        console.error("Error starting attendance:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error,
        });
    }
});
exports.startAttendance = startAttendance;
const verifyLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_js_1.default.findById(userId);
        const { attendenceId, lat, long, otp } = req.body;
        if (!user || user.userType !== "student") {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: "User not found",
            });
        }
        if (!attendenceId || !lat || !long || !otp) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false,
                error: "Missing required fields",
            });
        }
        const attendance = yield attendenModel_js_1.default.findById(attendenceId).populate({
            path: "location",
        });
        if (!attendance) {
            return res
                .status(404)
                .json({ message: "Attendance not found", success: false });
        }
        if (!attendance.isLive) {
            return res
                .status(400)
                .json({ message: "Attendance session has ended", success: false });
        }
        const location = (yield locationModel_js_1.default.findById(attendance.location));
        if (!location || !location.coordinates || !location.coordinates) {
            return res
                .status(404)
                .json({ message: "Location not found", success: false });
        }
        // Validate OTP
        if (attendance.otp !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }
        console.log("Attendance", attendance);
        console.log("Location", location.coordinates.coordinates);
        // Extract teacher's location and radius from the attendance document
        const [teacherLat, teacherLong] = location.coordinates.coordinates;
        console.log("TeacherLong", teacherLong);
        console.log("TeacherLat", teacherLat);
        // Calculate the distance between the teacher and the student
        const distance = (0, geolib_1.getDistance)({ latitude: teacherLat, longitude: teacherLong }, // Teacher's coordinates
        { latitude: parseFloat(lat), longitude: parseFloat(long) } // Student's coordinates
        );
        console.log("Distance", distance);
        const radius = attendance.locationRadius || 10; // Radius in meters
        if (distance <= radius) {
            console.log("Attendance Success");
            if (!attendance.attendance.includes(userId)) {
                attendance.attendance.push(userId);
                yield attendance.save();
            }
            return res
                .status(200)
                .json({ message: "Attendance marked successfully", success: true });
        }
        else {
            console.log("Attendance Success1");
            if (!attendance.attendanceTried.includes(userId)) {
                attendance.attendanceTried.push(userId);
                yield attendance.save();
            }
            return res.status(400).json({
                message: "You are not within the required radius",
                success: false,
            });
        }
    }
    catch (error) {
        console.error("Error verifying locations:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false, error: error });
    }
});
exports.verifyLocations = verifyLocations;
