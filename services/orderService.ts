import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db";
import { Order as OrderType } from "@/types/order";

export async function getOrders(): Promise<OrderType[]> {
  await connectDB();

  const orders = await Order.find()
    .populate({
      path: "customer",
      select: "name phone email",
      model: Customer,
    })
    .populate({
      path: "items.product",
      select: "name price",
      model: Product,
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(orders));
}

export async function getOrder(id: string): Promise<OrderType | null> {
  await connectDB();

  const order = await Order.findById(id)
    .populate({
      path: "customer",
      select: "name phone email",
      model: Customer,
    })
    .populate({
      path: "items.product",
      select: "name price",
      model: Product,
    })
    .lean();

  return order ? JSON.parse(JSON.stringify(order)) : null;
}