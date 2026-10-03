import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import { getInventory } from "@/services/inventoryService";

export async function GET() {
  try {
    const inventory = await getInventory();

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);

    return NextResponse.json(
      { message: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { productId, quantity } = body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { message: "Valid product ID is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity === 0) {
      return NextResponse.json(
        { message: "Quantity must be a non-zero integer" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        ...(quantity < 0 ? { stock: { $gte: Math.abs(quantity) } } : {}),
      },
      {
        $inc: { stock: quantity },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name category price stock");

    if (!product) {
      return NextResponse.json(
        {
          message:
            quantity < 0
              ? "Insufficient stock"
              : "Product not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to adjust inventory:", error);

    return NextResponse.json(
      { message: "Failed to adjust inventory" },
      { status: 500 }
    );
  }
}