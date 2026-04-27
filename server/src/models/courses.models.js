import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    minlength: 3
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

export default mongoose.model("Course", courseSchema);