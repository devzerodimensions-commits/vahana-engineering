import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Certification title is required"], trim: true },
    issuer: { type: String, default: "" },
    image: { type: String, default: "" },
    file: { type: String, default: "" }, // downloadable certificate / brochure
    description: { type: String, default: "" },
    year: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);
