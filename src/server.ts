import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import authRoute from "./route/authRoute.js";  
import classRoute from "./route/classRoute.js"
import { verifyAccessToken } from "./middleware/jwt_services.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const port = 3000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/classes", verifyAccessToken, classRoute);

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
