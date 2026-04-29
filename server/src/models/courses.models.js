import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },

    category: {
      type: [String],
      enum: [
        "AI",
        "ML",
        "Deep Learning",
        "NLP",

        "Web Dev",
        "Frontend",
        "Backend",
        "Full Stack",
        "Mobile App Development",

        "Data Science",
        "Data Analytics",
        "Big Data",
        "Data Engineering",

        "Cloud Computing",
        "DevOps",
        "Cyber Security",
        "Ethical Hacking",
        "Network Security",

        "Blockchain",
        "Web3",

        "Software Engineering",
        "System Design",
        "Microservices",

        "Database Management",
        "SQL",
        "NoSQL",

        "Internet of Things",
        "Embedded Systems",
      ],
      required: true,
    },

    description: {
      type: String,
      maxlength: 300,
    },

    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
