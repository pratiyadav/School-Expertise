import teachers from "../models/teachers.models.js";
import courses from "../models/courses.models.js";
import users from "../models/users.models.js";
import teacherRequest, { TeacherRequest,
} from "../models/teacherRequest.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidId } from "../utils/validate.js";

export const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()
    .populate("userID", "-password")
    .populate("courses");

  if (!teachers.length) {
    throw new ApiError(404, "No teacher found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachers, "Fetched teacher successfully"));
});

export const deleteTeacher = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Teacher ID is required");
  }

  if (!isValidId(id)) {
    throw new ApiError(400, "Invalid teacher ID format");
  }

  const teacher = await Teacher.findById(id);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  await Course.updateMany(
    { teachers: teacher._id },
    { $pull: { teachers: teacher._id } }
  );

  await Teacher.findByIdAndDelete(id);

  await User.findByIdAndUpdate(teacher.userId, {
    role: "STUDENT"
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Teacher deleted successfully")
  );
});

export const createCourse = asyncHandler(async (req, res) => {

  const { title, description } = req.body;

  if([title , description].some((field) => !field || !field.trim())){
    throw new ApiError(400 , "Need both title and description") ;
  }

  const existing = await Course.findOne({ title });

  if (existing) {
    throw new ApiError(400, "Course already exists");
  }

  const course = await Course.create({ title, description });

  if(!course){
    throw new ApiError(400 , "Course cannot be created right now") ;
  }

  return res.status(201).json(
    new ApiResponse(201, course, "Course created successfully")
  );
});

export const getCourses = async (req, res) => {
  const getCourse = await courses.find().populate({
    path: "teachers",
    populate: {
      path: "userId",
      select: "name email",
    },
  });
  res.json(getCourse);
};

export const assignTeacher = async (req, res) => {
  
    const { teacherId, courseId } = req.body;

    if (!teacherId || !courseId) {
    throw new ApiError(400, "Teacher ID and Course ID are required");
  }

  if (!isValidId(teacherId) || !isValidId(courseId)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const teacher = await Teacher.findById(teacherId);
  const course = await Course.findById(courseId);

  if (!teacher) throw new ApiError(404, "Teacher not found");
  if (!course) throw new ApiError(404, "Course not found");

  if (!teacher.courses.includes(courseId)) {
    teacher.courses.push(courseId);
  }

  if (!course.teachers.includes(teacherId)) {
    course.teachers.push(teacherId);
  }

  await teacher.save();
  await course.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Teacher assigned successfully")
  )
};

export const getPendingRequests = async (req, res) => {
  const requests = await TeacherRequest.find({ status: "PENDING" }).populate(
    "userId",
    "name email"
  );

  res.json(requests);
};

export const approveTeacher = asyncHandler(async (req, res) => {

  const { requestId } = req.body;

  if (!requestId) {
    throw new ApiError(400, "Request ID is required");
  }

  if (!isValidId(requestId)) {
    throw new ApiError(400, "Invalid request ID format");
  }

  const request = await TeacherRequest.findById(requestId);

  if (!request || request.status !== "PENDING") {
    throw new ApiError(400, "Invalid or already processed request");
  }

  const user = await User.findById(request.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = "TEACHER";
  await user.save();

  await Teacher.create({
    userId: user._id,
    specialization: ["Not Set"]
  });

  request.status = "APPROVED";
  request.reviewedBy = req.user?._id;
  request.reviewedAt = new Date();

  await request.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Teacher approved successfully")
  );
});

export const rejectTeacher = asyncHandler(async (req, res) => {

  const { requestId } = req.body;

  if (!requestId) {
    throw new ApiError(400, "Request ID is required");
  }

  if (!isValidId(requestId)) {
    throw new ApiError(400, "Invalid request ID format");
  }

  const request = await TeacherRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (request.status !== "PENDING") {
    throw new ApiError(400, "Request already processed");
  }

  request.status = "REJECTED";
  request.reviewedBy = req.user?._id;
  request.reviewedAt = new Date();

  await request.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Teacher rejected successfully")
  );
});
