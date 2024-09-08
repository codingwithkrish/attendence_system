import express from "express";
import { createClass,joinClass,getAllClasses} from "../controller/classController/classController.js";
const router = express.Router();
router.get("/",getAllClasses);
router.post("/",createClass);
router.post("/joinClass",joinClass);
export default router;