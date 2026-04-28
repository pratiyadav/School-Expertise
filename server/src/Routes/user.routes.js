import { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router() ; 

userRouter.post("/register" , 
    upload.fields(
    [
        {
            name: "avatar" ,
            maxCount: 1
        }
    ]) 
    , register
);

userRouter.post("/login" , login)

userRouter.post("/logout" , verifyJWT , logout) ; 

userRouter.post("/refresh-token" , refreshAccessToken)



export {userRouter} 