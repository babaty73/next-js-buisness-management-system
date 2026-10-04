import Product from "@/models/Product";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db";

export async function getDashboardStats() {
  await connectDB();

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),

    Order.countDocuments({
      status: "pending",
    }),

    Order.countDocuments({
      status: "completed",
    }),

    Product.countDocuments(),

    Product.countDocuments({
      stock: {
        $gt: 0,
        $lte: 10,
      },
    }),

    Product.countDocuments({
      stock: 0,
    }),

    Order.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),

    Order.find()
  .populate({
    path: "customer",
    select: "name phone",
    model: Customer,
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .lean()
  ]);

  const totalRevenue = revenueResult[0]?.total ?? 0;

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalRevenue,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
  };
}