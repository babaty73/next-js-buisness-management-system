import mongoose, { Schema, models, Model } from "mongoose";

interface ProductDocument {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<ProductDocument> =
  (models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", productSchema);

export default Product;