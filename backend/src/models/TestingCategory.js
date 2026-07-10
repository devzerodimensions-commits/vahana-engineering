import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const testingCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Category name is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    blurb: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    standards: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testingCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

export default mongoose.model("TestingCategory", testingCategorySchema);
