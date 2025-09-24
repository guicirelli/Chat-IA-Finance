import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Badge || mongoose.model("Badge", BadgeSchema);
