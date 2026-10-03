import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

export async function getInventory() {
  await connectDB();

  const products = await Product.find()
    .select("name category price stock")
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(products));
}