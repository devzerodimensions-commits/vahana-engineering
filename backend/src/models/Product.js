import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, required: true }, // testing-category slug
    categoryName: { type: String },
    image: { type: String, default: "" },
    gallery: [{ type: String }],
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    standards: [{ type: String }],
    specifications: [{ label: String, value: String }],
    price: { type: String, default: "On Request" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) this.slug = slugify(this.name);
  next();
});

productSchema.index({ name: "text", summary: "text", description: "text" });

export default mongoose.model("Product", productSchema);
