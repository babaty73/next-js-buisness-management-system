import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("customer", "name phone email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const order = await Order.create(body);

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name phone email")
      .populate("items.product", "name price");

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("POST order error:", error);

    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}