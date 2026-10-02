"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  product: string;
  quantity: number;
}

export default function OrderForm() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { product: "", quantity: 1 },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
        ]);

        if (!customersResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to load customers or products");
        }

        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();

        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function addItem() {
    setItems([...items, { product: "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;

    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateItem(
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) {
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  function getProduct(productId: string) {
    return products.find((product) => product._id === productId);
  }

  const previewTotal = items.reduce((total, item) => {
    const product = getProduct(item.product);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!customer) {
      setError("Please select a customer.");
      return;
    }

    const invalidItem = items.some(
      (item) => !item.product || item.quantity < 1
    );

    if (invalidItem) {
      setError("Please select a product and valid quantity for every item.");
      return;
    }

    const duplicateProducts = new Set(
      items.map((item) => item.product)
    );

    if (duplicateProducts.size !== items.length) {
      setError("A product can only be added once to an order.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      router.push("/orders");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create order"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading order data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/orders"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Order
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new customer order.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Customer
            </h2>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Select Customer
              </span>

              <select
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              >
                <option value="">Select a customer</option>

                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} — {customer.phone}
                  </option>
                ))}
              </select>
            </label>

            {customers.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">
                No customers found.{" "}
                <Link
                  href="/customers/new"
                  className="font-medium text-gray-900 underline"
                >
                  Create a customer first.
                </Link>
              </p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add products to this order.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Plus size={17} />
                Add Product
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const product = getProduct(item.product);

                return (
                  <div
                    key={index}
                    className="grid gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-[1fr_120px_120px_40px] sm:items-end"
                  >
                    <label>
                      <span className="mb-2 block text-sm font-medium text-gray-700">
                        Product
                      </span>

                      <select
                        value={item.product}
                        onChange={(event) =>
                          updateItem(
                            index,
                            "product",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      >
                        <option value="">Select product</option>

                        {products.map((product) => (
                          <option
                            key={product._id}
                            value={product._id}
                            disabled={
                              items.some(
                                (existingItem, existingIndex) =>
                                  existingIndex !== index &&
                                  existingItem.product === product._id
                              )
                            }
                          >
                            {product.name} — ${product.price.toFixed(2)} (
                            {product.stock} in stock)
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span className="mb-2 block text-sm font-medium text-gray-700">
                        Quantity
                      </span>

                      <input
                        type="number"
                        min="1"
                        max={product?.stock || undefined}
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(
                            index,
                            "quantity",
                            Number(event.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      />
                    </label>

                    <div>
                      <span className="mb-2 block text-sm font-medium text-gray-700">
                        Subtotal
                      </span>

                      <p className="py-2.5 text-sm font-semibold text-gray-900">
                        $
                        {product
                          ? (product.price * item.quantity).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="flex h-10 items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Remove product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {products.length === 0 && (
              <p className="mt-4 text-sm text-gray-500">
                No products found.{" "}
                <Link
                  href="/products/new"
                  className="font-medium text-gray-900 underline"
                >
                  Create a product first.
                </Link>
              </p>
            )}
          </section>
        </div>

        {/* Summary */}
        <div>
          <section className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 border-b border-gray-200 pb-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Products</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span>
                  {items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-5">
              <span className="font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ${previewTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={
                saving ||
                customers.length === 0 ||
                products.length === 0
              }
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating Order..." : "Create Order"}
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}