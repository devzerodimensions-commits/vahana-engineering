import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Service title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) this.slug = slugify(this.title);
  next();
});

export default mongoose.model("Service", serviceSchema);
