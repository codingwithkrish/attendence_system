"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classController_js_1 = require("../controller/classController/classController.js");
const router = express_1.default.Router();
router.get("/", classController_js_1.getAllClasses);
router.post("/", classController_js_1.createClass);
router.post("/joinClass", classController_js_1.joinClass);
router.post("/getClassById", classController_js_1.getClassById);
exports.default = router;
