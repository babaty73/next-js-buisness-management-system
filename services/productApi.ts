import type { Product } from "@/types/product";

const API_URL = "/api/products";

export async function createProduct(
  data: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Failed to create product"
    );
  }

  return response.json();
}