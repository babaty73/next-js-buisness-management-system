"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CustomerActions({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete customer"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/customers/${customerId}/edit`}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        title="Edit customer"
      >
        <Pencil size={17} strokeWidth={1.8} />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        title="Delete customer"
      >
        <Trash2 size={17} strokeWidth={1.8} />
      </button>
    </div>
  );
}