import mongoose from "mongoose";

// Product / quote inquiries raised from product pages.
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    product: { type: String, default: "" }, // product name or slug
    quantity: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "in-progress", "quoted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
