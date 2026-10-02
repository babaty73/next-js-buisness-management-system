import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";

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
  const session = await mongoose.startSession();

  try {
    const body = await request.json();

    const { customer, items } = body;

    if (!customer || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Customer and at least one product are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return NextResponse.json(
        { message: "Invalid customer ID" },
        { status: 400 }
      );
    }

    await connectDB();

    let createdOrder;

    await session.withTransaction(async () => {
      // 1. Verify customer
      const existingCustomer = await Customer.findById(customer).session(
        session
      );

      if (!existingCustomer) {
        throw new Error("Customer not found");
      }

      let totalAmount = 0;

      const orderItems = [];

      // 2. Process every requested product
      for (const item of items) {
        if (
          !item.product ||
          !mongoose.Types.ObjectId.isValid(item.product) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
          throw new Error("Invalid product or quantity");
        }

        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${product.name}. Available: ${product.stock}`
          );
        }

        // Price comes from MongoDB, NOT the browser
        const itemTotal = product.price * item.quantity;

        totalAmount += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        // 3. Decrease stock
        product.stock -= item.quantity;
        await product.save({ session });
      }

      // 4. Create order using server-calculated values
      const orders = await Order.create(
        [
          {
            customer: existingCustomer._id,
            items: orderItems,
            totalAmount,
            status: "pending",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    const populatedOrder = await Order.findById(createdOrder!._id)
      .populate("customer", "name phone email")
      .populate("items.product", "name price");

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error("POST order error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create order",
      },
      { status: 400 }
    );
  } finally {
    await session.endSession();
  }
}