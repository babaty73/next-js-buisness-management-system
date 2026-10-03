import InventoryActions from "@/components/inventory/InventoryActions";
import { getInventory } from "@/services/inventoryService";

function getStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      className: "bg-red-100 text-red-700",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low Stock",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "In Stock",
    className: "bg-green-100 text-green-700",
  };
}

export default async function InventoryPage() {
  const products = await getInventory();

  const totalProducts = products.length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 10
  ).length;
  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and adjust product stock.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Units
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalUnits}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-yellow-600">
              Low Stock
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {lowStock}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-red-600">
              Out of Stock
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {outOfStock}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Stock Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Current stock levels for all products.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="font-semibold text-gray-900">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create products first to manage their inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <InventoryActions
                            productId={product._id}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}