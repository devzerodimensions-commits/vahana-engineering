import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, required: [true, "Image is required"] },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
