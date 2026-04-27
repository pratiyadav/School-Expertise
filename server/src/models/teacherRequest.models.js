import mongoose, { Schema } from "mongoose";

const teacherRequestSchema = new Schema(
{
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        maxLength: 300
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: Date
},
{
    timestamps: true
});

export const TeacherRequest = mongoose.model("TeacherRequest",teacherRequestSchema);