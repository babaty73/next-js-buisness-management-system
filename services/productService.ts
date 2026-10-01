import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

export async function getProducts() {
  await connectDB();

  return Product.find().sort({ createdAt: -1 }).lean();
}

export async function getProduct(id: string) {
  await connectDB();

  return Product.findById(id).lean();
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
}) {
  await connectDB();

  return Product.create(data);
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }>
) {
  await connectDB();

  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
}

export async function deleteProduct(id: string) {
  await connectDB();

  return Product.findByIdAndDelete(id);
}