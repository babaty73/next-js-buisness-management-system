import mongoose, { Schema, models } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const Customer =
  models.Customer || mongoose.model("Customer", CustomerSchema);
