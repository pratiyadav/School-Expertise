import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export {userRouter} 