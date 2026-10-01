import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your products, prices, and inventory.
            </p>
          </div>

          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {products.reduce((total, product) => total + product.stock, 0)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {products.filter((product) => product.stock < 10).length}
            </p>
          </div>
        </div>

        {/* Product table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Product Inventory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A list of all products in your inventory.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                📦
              </div>

              <h3 className="font-semibold text-gray-900">
                No products yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first product to start managing your inventory.
              </p>

              <Link
                href="/products/new"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const lowStock = product.stock < 10;
                    const outOfStock = product.stock === 0;

                    return (
                      <tr
                        key={product._id.toString()}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>

                            {product.description && (
                              <p className="mt-1 max-w-xs truncate text-gray-500">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          {outOfStock ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Out of stock
                            </span>
                          ) : lowStock ? (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                              Low stock
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              In stock
                            </span>
                          )}
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