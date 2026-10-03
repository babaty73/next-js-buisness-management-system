"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export default function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: OrderStatus) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "pending" && (
        <button
          type="button"
          onClick={() => updateStatus("confirmed")}
          disabled={loading}
          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
          title="Confirm order"
        >
          <Check size={17} />
        </button>
      )}

      {status === "confirmed" && (
        <button
          type="button"
          onClick={() => updateStatus("completed")}
          disabled={loading}
          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
          title="Complete order"
        >
          <Check size={17} />
        </button>
      )}

      {(status === "pending" || status === "confirmed") && (
        <button
          type="button"
          onClick={() => updateStatus("cancelled")}
          disabled={loading}
          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          title="Cancel order"
        >
          <X size={17} />
        </button>
      )}

      {error && (
        <span className="text-xs text-red-600" title={error}>
          Error
        </span>
      )}
    </div>
  );
}