import { asyncHandler } from "../utils/AsyncHandler.js";
import { Course } from "../models/courses.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const getCourse = asyncHandler(async (req , res) => {
    const courses = await Course.find({}).select("_id title description") ;

    return res.status(200).json(new ApiResponse(200 , courses , "Courses Fetch Successfully")) ; 
})

const getTeachersFromCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid course id");
    }

    const course = await Course.findById(courseId)
        .populate({
            path: "teachers",
            select: "bio specialization",
            populate: {
            path: "userId",
            select: "name"
        }
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const teachers = course.teachers.map(t => ({
        name: t.userId.name,
        bio: t.bio,
        specialization: t.specialization
    }));

    return res.status(200).json(
        new ApiResponse(200, teachers, "Teachers fetched successfully")
    );
});

const getTeachersByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const allowedCategories = ["AI", "ML", "Deep Learning", "Web Dev", "Data Science", "Security"];

    if (!allowedCategories.includes(category)) {
        throw new ApiError(400, "Invalid category");
    }

    const result = await Course.aggregate([
        {
        $match: {
            category: category
        }
    },

    {
        $unwind: "$teachers"
    },

    {
        $group: {
            _id: "$teachers"
        }
    },

    {
        $lookup: {
            from: "teachers",
            ocalField: "_id",
            foreignField: "_id",
            as: "teacher"
        }
    },

    { $unwind: "$teacher" },

    {
        $lookup: {
            from: "users",
            localField: "teacher.userId",
            foreignField: "_id",
            as: "user"
        }
    },

    { $unwind: "$user" },

    {
        $project: {
            _id: 0,
            name: "$user.name",
            bio: "$teacher.bio",
            specialization: "$teacher.specialization"
        }
    }
]);

    if (!result.length) {
        throw new ApiError(404, "No teachers found for this category");
    }

    return res.status(200).json(
        new ApiResponse(200, result, "Teachers fetched by category")
    );
});


export {getCourse , getTeachersFromCourse , getTeachersByCategory} ;