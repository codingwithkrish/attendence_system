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
const classRoute_js_1 = __importDefault(require("./route/classRoute.js")); // Update the import to use createClassRouter
const jwt_services_js_1 = require("./middleware/jwt_services.js");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_js_1.default)();
// Set up HTTP server and Socket.IO
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
// Define any Socket.IO options here if needed
});
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
const port = 3000;
app.use("/api/v1/auth", authRoute_js_1.default);
// Pass `io` to the class router
app.use("/api/v1/classes", jwt_services_js_1.verifyAccessToken, (0, classRoute_js_1.default)(io));
app.get('/', (req, res) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});
// Error-handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
