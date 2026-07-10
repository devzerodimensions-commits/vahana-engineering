import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Blog title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    author: { type: String, default: "Vihana Engineering" },
    image: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) this.slug = slugify(this.title);
  next();
});

blogSchema.index({ title: "text", excerpt: "text", content: "text" });

export default mongoose.model("Blog", blogSchema);
