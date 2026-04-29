import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes

import { healthRouter } from "./Routes/health.routes.js";
import { userRouter } from "./Routes/user.routes.js";
import { adminRouter } from "./Routes/admin.routes.js";

app.use("/api/v1/check", healthRouter);
app.use("/api/v1/users" , userRouter) ; 
app.use("/api/v1/admin" , adminRouter) ;

// error handler (MUST be last)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong"
    });
});

export { app };