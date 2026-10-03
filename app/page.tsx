import Link from "next/link";
import { getDashboardStats } from "@/services/dashboardservice";

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your business activity.
          </p>
        </div>

        {/* Main Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Completed orders
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              All orders
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending Orders
            </p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Waiting for confirmation
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Completed Orders
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {stats.completedOrders}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Successfully completed
            </p>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/products"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
          >
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              View products →
            </p>
          </Link>

          <Link
            href="/inventory"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-yellow-300"
          >
            <p className="text-sm font-medium text-yellow-600">
              Low Stock
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.lowStockProducts}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              View inventory →
            </p>
          </Link>

          <Link
            href="/inventory"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-red-300"
          >
            <p className="text-sm font-medium text-red-600">
              Out of Stock
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stats.outOfStockProducts}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              View inventory →
            </p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Orders
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest customer orders.
              </p>
            </div>

            <Link
              href="/orders"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="font-semibold text-gray-900">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Orders will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Customer
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Total
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {order.customer?.name ?? "Unknown Customer"}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}