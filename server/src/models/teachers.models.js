import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  bio: {
    type: String,
    maxlength: 300
  },

  experience: {
    type: Number,
    min: 0,
    max: 40,
    default: 0
  },

  specialization: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message: "At least one specialization required"
    }
  },

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ]

}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", teacherSchema);