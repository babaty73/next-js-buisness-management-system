import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import { Order as OrderType } from "@/types/order";

export async function getOrders(): Promise<OrderType[]> {
  await connectDB();

  const orders = await Order.find()
    .populate("customer", "name phone email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(orders));
}

export async function getOrder(id: string): Promise<OrderType | null> {
  await connectDB();

  const order = await Order.findById(id)
    .populate("customer", "name phone email")
    .populate("items.product", "name price")
    .lean();

  return order ? JSON.parse(JSON.stringify(order)) : null;
}