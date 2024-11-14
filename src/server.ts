import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import authRoute from "./route/authRoute.js";  
import createClassRouter from "./route/classRoute.js"; // Update the import to use createClassRouter
import { verifyAccessToken } from "./middleware/jwt_services.js";
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
connectDB();

// Set up HTTP server and Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // Define any Socket.IO options here if needed
});

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const port = 3000;

app.use("/api/v1/auth", authRoute);

// Pass `io` to the class router
app.use("/api/v1/classes", verifyAccessToken, createClassRouter(io));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
