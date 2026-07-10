import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Client name is required"], trim: true },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    industry: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
