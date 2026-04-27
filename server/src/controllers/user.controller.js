import { User } from "../models/users.models.js";
import { TeacherRequest } from "../models/teacherReaquest.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId) ; 
        const accessToken = user.generateAccessToken() ; 
        const refreshToken = user.generateRefreshToken() ; 
    
        user.refreshToken = refreshToken ; 
    
        await user.save({validateBeforeSave : false}) ; 
    
        return {accessToken , refreshToken} ;
    } catch (error) {
        throw new ApiError(500 , "Something went while generating access and refresh token") ; 
    }
}

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field || !field.trim())) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
        throw new ApiError(400, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatar.url,
    });

    const newUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (req.body.teacherRequest) {
        await TeacherRequest.create({
            userId: user._id,
            message: req.body.message,
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newUser, "User created successfully"));
});

const login = asyncHandler(async (req , res) => {
    // get email and password form user
    // check if get both or not
    // generate token
    // store the token in cookie
})


export {register}