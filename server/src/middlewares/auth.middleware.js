import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError';

const verifyJWT = asyncHandler(async(req , res , next) => {
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

    if(!token){
        throw new ApiError(401 , "Unothorized Request") ; 
    }
})