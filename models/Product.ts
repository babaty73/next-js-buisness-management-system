import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);
