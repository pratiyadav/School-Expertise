import { User } from "../models/users.models.js";
import { TeacherRequest } from "../models/teacherRequest.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken" ; 


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId) ; 

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken() ; 
        const refreshToken = user.generateRefreshToken() ; 
    
        user.refreshToken = refreshToken ; 
    
        await user.save({validateBeforeSave : false}) ; 
    
        return {accessToken , refreshToken} ;
    } catch (error) {
        throw new ApiError(500, error.message || "Token generation failed");
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

    if (!avatar?.url) {
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

    const {email , password} = req.body ; 

    if([email , password].some((field) => !field || !field.trim())){
        throw new ApiError(400 , "Require both email and password") ; 
    }

    const user = await User.findOne({email}).select("+password") ; 

    if(!user){
        throw new ApiError(404 , "User do not exist") ; 
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password) ; 

    if(!isPasswordCorrect){
        throw new ApiError(401 , "Invalid Credentials")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id) ; 

    const option = {
        httpOnly: true , 
        // secure : true ,
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") ; 

    return res.status(200)
    .cookie("accessToken", accessToken , option)
    .cookie("refreshToken" , refreshToken , option)
    .json(new ApiResponse(200 , loggedInUser , "Successfully logged in")) ; 
})

const logout = asyncHandler(async(req , res) => {
    const userId = req.user._id ; 

    await User.findOneAndUpdate(
        userId ,
        {
            $unset: {
                refreshToken : 1 ,
            }
        },
        {
            new: true 
        }
    )

    const option = {
        httpOnly: true
    }

    res.status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200 , {} , "User Logout Successfully")) ; 
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken =
        req.cookies.refreshToken || req.body?.refreshToken;

    if (!incomingToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const safeUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: safeUser,
                        accessToken,
                        refreshToken,
                    },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid Refresh Token"
        );
    }
});

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    .select("-password -refreshToken");

        return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});

export {register , login , logout , refreshAccessToken , getMe}