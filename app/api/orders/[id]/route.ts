import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedTransitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(id)
      .populate("customer", "name phone email")
      .populate("items.product", "name price");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET order error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const session = await mongoose.startSession();

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    await connectDB();

    let updatedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === body.status) {
        throw new Error("Order already has this status");
      }

      if (!allowedTransitions[order.status]?.includes(body.status)) {
        throw new Error(
          `Cannot change order from ${order.status} to ${body.status}`
        );
      }

      // If an order is cancelled, return its products to inventory.
      if (body.status === "cancelled") {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: { stock: item.quantity },
            },
            { session }
          );
        }
      }

      order.status = body.status;
      updatedOrder = await order.save({ session });
    });

    const populatedOrder = await Order.findById(updatedOrder!._id)
      .populate("customer", "name phone email")
      .populate("items.product", "name price");

    return NextResponse.json(populatedOrder);
  } catch (error) {
    console.error("PUT order error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order",
      },
      { status: 400 }
    );
  } finally {
    await session.endSession();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE order error:", error);

    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}