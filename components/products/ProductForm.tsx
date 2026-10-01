"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productApi";

export default function ProductForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);

      await createProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
      });

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <input
        name="name"
        placeholder="Product name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full rounded border p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        min="0"
        className="w-full rounded border p-3"
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        required
        min="0"
        className="w-full rounded border p-3"
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}