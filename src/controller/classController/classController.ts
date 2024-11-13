import User from "../../models/userModel.js";
import Class from "../../models/classModel.js";

// Controller function to create a new class

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
        const { className, description, imageUrl,classCode, attendance = [], students = [], notices = [] } = req.body;

        if(classCode.length !== 6){
            return res.status(400).json({ message: "Class code must be 6 characters"});
        }
        //random number 
         var newclassCode = Math.floor(1000 + Math.random() * 9000);
         newclassCode+=classCode;
        // Create a new instance of the Class model
        const newClass = new Class({
            createdBy: userId,
            className,
            description,
            imageUrl,
            classCode:newclassCode,
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
            return res.status(404).json({ message: "User not found",success:false });
        }
        if(user.userType === "student"){
            const classes = await Class.find({students:userId});
            return res.status(200).json({message:"Classes Fetched",success:true,data:classes});
        }

        const classes = await Class.find({createdBy:user});
        return res.status(200).json({message:"Classes Fetched",success:true,data:classes});

    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal Server Error",success:false });
    }
};
export const joinClass = async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user || !(user.userType === "student")) {
            return res.status(404).json({ message: "User not found" });}
        const {classCode} = req.body;
        console.log("ClassCode",classCode);
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
    try
    {
         const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user ) {
            return res.status(404).json({ message: "User not found" });}
        const {classCode} = req.body;
        console.log("ClassCode",classCode);
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
        res.status(200).json({success:true, message: "Successfully fetched class",data:classData });
    }catch(error){ 
        console.error("Error joining class:", error);
        res.status(500).json({success:false, message: "Internal Server Error" });
    }
}
