import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

// Career openings.
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    department: { type: String, default: "" },
    location: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experience: { type: String, default: "" },
    description: { type: String, default: "" },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title) + "-" + Math.random().toString(36).slice(2, 6);
  }
  next();
});

export default mongoose.model("Job", jobSchema);
