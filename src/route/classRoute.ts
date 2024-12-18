import express from "express";
import { Server } from "socket.io";

import { createClass,joinClass,getAllClasses,getClassById,getStudents,startAttendance,verifyLocations,getAttendance,getStudentAttendanceById} from "../controller/classController/classController.js";
const router = express.Router();
export const createClassRouter = (io: any) => {
    router.get("/", getAllClasses);
    router.get("/getAttendence/:classId",getAttendance);
    router.get("/getStudentAttendence/:attendanceId",getStudentAttendanceById);
    router.post("/", createClass);
    router.get("/getStudents/:classId", getStudents); 
    router.post("/joinClass", joinClass);
    router.post("/getClassById", getClassById);
    
    // Pass `io` to `startAttendance`
   router.post("/startAttendance", startAttendance(io));
   router.post("/verifyAttendance", verifyLocations);


    return router;
};

export default createClassRouter;