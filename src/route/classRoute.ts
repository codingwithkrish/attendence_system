import express from "express";
import { createClass,joinClass} from "../controller/classController/classController.js";
const router = express.Router();
router.post("/",createClass);
router.post("/joinClass",joinClass);
export default router;