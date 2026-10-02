import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find().sort({ createdAt: -1 });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET customers error:", error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const customer = await Customer.create(body);

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST customer error:", error);

    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}