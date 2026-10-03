"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InventoryActions({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function adjustStock(amount: number) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/inventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to adjust stock");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to adjust stock"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(event) =>
          setQuantity(Math.max(1, Number(event.target.value)))
        }
        className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-gray-500"
      />

      <button
        type="button"
        onClick={() => adjustStock(quantity)}
        disabled={loading}
        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
        title="Add stock"
      >
        <Plus size={17} />
      </button>

      <button
        type="button"
        onClick={() => adjustStock(-quantity)}
        disabled={loading}
        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        title="Remove stock"
      >
        <Minus size={17} />
      </button>

      {error && (
        <span
          className="max-w-[120px] truncate text-xs text-red-600"
          title={error}
        >
          {error}
        </span>
      )}
    </div>
  );
}