"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassRouter = void 0;
const express_1 = __importDefault(require("express"));
const classController_js_1 = require("../controller/classController/classController.js");
const router = express_1.default.Router();
const createClassRouter = (io) => {
    router.get("/", classController_js_1.getAllClasses);
    router.post("/", classController_js_1.createClass);
    router.get("/getStudents/:classId", classController_js_1.getStudents);
    router.post("/joinClass", classController_js_1.joinClass);
    router.post("/getClassById", classController_js_1.getClassById);
    // Pass `io` to `startAttendance`
    router.post("/startAttendance", (0, classController_js_1.startAttendance)(io));
    router.post("/verifyAttendance", classController_js_1.verifyLocations);
    return router;
};
exports.createClassRouter = createClassRouter;
exports.default = exports.createClassRouter;
