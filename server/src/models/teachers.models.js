import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  bio: String,bio: {
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
  }

}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);