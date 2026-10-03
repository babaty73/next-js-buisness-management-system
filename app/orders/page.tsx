import Link from "next/link";
import OrderActions from "@/components/orders/OrderActions";
import { getOrders } from "@/services/orderService";
export default async function OrdersPage() {
  const orders = await getOrders();

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.totalAmount, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders and their status.
            </p>
          </div>

          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Create Order
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {completedOrders}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Revenue
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Order History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A list of all customer orders.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                🛒
              </div>

              <h3 className="font-semibold text-gray-900">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create your first order to start tracking sales.
              </p>

              <Link
                href="/orders/new"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Items</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order._id.toString()}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                         {typeof order.customer === "object"
                            ? order.customer.name
                            : "Unknown Customer"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {order.items.length}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <OrderActions
                            orderId={order._id.toString()}
                            status={order.status}
                        />
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