"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const authRoute_js_1 = __importDefault(require("./route/authRoute.js"));
const classRoute_js_1 = __importDefault(require("./route/classRoute.js"));
const jwt_services_js_1 = require("./middleware/jwt_services.js");
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_js_1.default)();
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
const port = 3000;
app.use("/api/v1/auth", authRoute_js_1.default);
app.use("/api/v1/classes", jwt_services_js_1.verifyAccessToken, classRoute_js_1.default);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
