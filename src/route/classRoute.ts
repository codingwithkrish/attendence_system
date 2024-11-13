import express from "express";
import { createClass,joinClass,getAllClasses,getClassById} from "../controller/classController/classController.js";
const router = express.Router();
router.get("/",getAllClasses);
router.post("/",createClass);
router.post("/joinClass",joinClass);
router.post("/getClassById",getClassById)
export default router;