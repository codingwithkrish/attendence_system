import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import authRoute from "./route/authRoute.js";  
const app = express();
dotenv.config();
connectDB()

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
const port = 3000;
app.use("/api/v1/auth", authRoute)


app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});