import User from "../../models/userModel.js";
import Class from "../../models/classModel.js";
import otpGenerator from 'otp-generator';
import AttendanceModel from "../../models/attendenModel.js";
import Location from "../../models/locationModel.js";
// Controller function to create a new class
import { Server } from "socket.io";

export const createClass = async (req: any, res: any) => {
    try {
        // Get the user ID from the request (assuming it's stored in req.user._id)
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

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
        const newClass = new Class({
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
        const savedClass = await newClass.save();

        // Respond with the created class
        res.status(201).json(savedClass);

    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getAllClasses = async (req: any, res: any) => {
    try {
        // Get the user ID from the request (assuming it's stored in req.user._id)
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (user.userType === "student") {
            const classes = await Class.find({ students: userId });
            return res.status(200).json({ message: "Classes Fetched", success: true, data: classes });
        }

        const classes = await Class.find({ createdBy: user });
        return res.status(200).json({ message: "Classes Fetched", success: true, data: classes });

    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
export const joinClass = async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user || !(user.userType === "student")) {
            return res.status(404).json({ message: "User not found" });
        }
        const { classCode } = req.body;
        console.log("ClassCode", classCode);
        if (!classCode) {
            return res.status(400).json({ message: "Class code is required" });

        }
        const classData = await Class.findById(classCode);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        classData.students.push(userId);

        await classData.save();
        res.status(200).json({ message: "Successfully joined class" });
    } catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getClassById = async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { classCode } = req.body;
        console.log("ClassCode", classCode);
        if (!classCode) {
            return res.status(400).json({ message: "Class code is required" });

        }
        const classData = await Class.findById(classCode).populate({
            path: "createdBy",
            select: "-password" // Exclude the password field
        });
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ success: true, message: "Successfully fetched class", data: classData });
    } catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getStudents = async (req: any, res: any) => {
    const { classId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const options = {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
            populate: {
                path: 'students',
                select: 'name email',
            },
        };

        const result = await Class.paginate(
            { _id: classId },
            options
        );
        const students = result.docs.flatMap((doc) => doc.students);


        return res.status(200).json({
            success: true, data: {
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
                docs: students,
            }, message: 'Students fetched successfully'
        });
    } catch (error) {
        console.error('Error getting students:', error);
        return res.status(500).json({ error: 'Error getting students', success: false, message: 'Internal Server Error' });
    }
}

// Initialize Socket.IO (assuming you have an Express server)
export const startAttendance = (io: Server)=> async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        // Check if user is a teacher
        if (!user || user.userType !== "teacher") {
            return res.status(404).json({ message: "User not found", success: false, error: "User not found" });
        }
        console.log("User", user);

        // Extract data from request
        const { classId, lat, long, radius, time, address } = req.body;
        if (!classId || !lat || !long || !radius || !time || !address) {
            return res.status(400).json({ message: "Missing required fields", success: false, error: "Missing required fields" });
        }
          console.log("ClassId", classId);

        const classData = await Class.findById(classId);
console.log("ClassId", classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found", success: false, error: "Class not found" });
        }

        // Check if the teacher is authorized for this class
        console.log("ClassData", classData);
        console.log("ClassData", classData.createdBy.toString());
        console.log("UserId", userId);
        if (classData.createdBy.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Not Authorized", success: false, error: "Not Authorized" });
        }

        // Generate OTP and create a location entry
        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const newLocation = new Location({
            coordinates: {
                type: 'Point',
                coordinates: [long, lat]
            },
            address: address
        });

        await newLocation.save();
        
        // Create attendance record
        const newAttendance = new AttendanceModel({
            classId,
            timer: time,
            locationRadius: radius,
            otp: OTP,
            location: newLocation._id
        });
        
        await newAttendance.save();

        // Add attendance to class data
        classData.attendance.push(newAttendance._id);
        await classData.save();

        // WebSocket handling
        const classSocket = io.of(`/attendance/${classId}`);
        
        classSocket.on("connection", (socket) => {
            console.log(`New student connected for class ${classId}`);

            // Emit the start of attendance to students
            socket.emit("attendanceStarted", { message: "Attendance started", OTP, time });

            // Countdown timer
            let countdown = time;
            const countdownInterval = setInterval(() => {
                countdown -= 1;
                socket.emit("countdown", { timeLeft: countdown });

                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    socket.emit("attendanceEnded", { message: "Attendance session ended" });
                    classSocket.disconnectSockets();
                }
            }, 1000);
            
            // Handling student attendance marking
            socket.on("markAttendance", async (studentData) => {
                // Here you can check and process student attendance
                console.log(`Student attendance marked: ${studentData.studentId}`);
                // Example logic:
                // await markStudentAttendance(studentData.studentId, classId);
            });

            // Clean up on disconnect
            socket.on("disconnect", () => {
                console.log(`Student disconnected from class ${classId}`);
            });
        });

        // Respond to the teacher
        return res.status(200).json({ message: "Attendance started", success: true, data: newAttendance });
    } catch (error) {
        console.error("Error starting attendance:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error:error });
    }
};
