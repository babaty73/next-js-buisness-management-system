import { NextRequest, NextResponse } from "next/server";
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

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity)) {
      return NextResponse.json(
        { message: "Quantity must be an integer" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Inventory adjustment endpoint ready" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to adjust inventory:", error);

    return NextResponse.json(
      { message: "Failed to adjust inventory" },
      { status: 500 }
    );
  }
}