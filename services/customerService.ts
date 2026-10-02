import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db";

export async function getCustomers() {
  await connectDB();

  return Customer.find().sort({ createdAt: -1 }).lean();
}

export async function getCustomer(id: string) {
  await connectDB();

  return Customer.findById(id).lean();
}