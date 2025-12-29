import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";




const app=express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://assignment-hubz.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 🔴 MUST be before routes


//user router
import userRouter from './routes/user.route.js'
app.use('/api/v1/user',userRouter)

import assignmentRouter from './routes/assignment.route.js'
app.use('/api/v1/assignment',assignmentRouter)


export default app
