import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
