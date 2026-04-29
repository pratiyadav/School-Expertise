import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    minlength: 3
  },

  category: {
    type: [String],
    enum: ["AI", "ML", "Deep Learning", "Web Dev", "Data Science" , "Security"],
    required: true
  },

  description: {
    type: String,
    maxlength: 300
  },

  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }]

}, { timestamps: true });

export const Course =  mongoose.model("Course", courseSchema);