import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://node-mailer-test-project-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
import authRoute from "./routes/authRoute.js";
app.use("/api/v1/auth", authRoute);
connectDB();
app.listen(PORT, () => {
  console.log(`PORT IS RUNNING ON ${PORT}`);
});
