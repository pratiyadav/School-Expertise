import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getTeachers,
  createCourse,
  getCourses,
  assignTeacher,
  getPendingRequests,
  approveTeacher,
  rejectTeacher,
  deleteTeacher,
  getCategory,
} from "../controllers/admin.controller.js";

const adminRouter = Router();


adminRouter.get("/teachers", verifyJWT, verifyAdmin, getTeachers);
adminRouter.delete("/delete/:id", verifyJWT, verifyAdmin, deleteTeacher);
adminRouter.get("/courses", verifyJWT, verifyAdmin, getCourses);
adminRouter.post("/assign", verifyJWT, verifyAdmin, assignTeacher);
adminRouter.get("/requests", verifyJWT, verifyAdmin, getPendingRequests);
adminRouter.post("/approve/:id", verifyJWT, verifyAdmin, approveTeacher);
adminRouter.post("/reject/:id", verifyJWT, verifyAdmin, rejectTeacher);
adminRouter.post("/create/", verifyJWT,verifyAdmin,createCourse);
adminRouter.get("/category" , verifyJWT , verifyAdmin , getCategory)
export { adminRouter };