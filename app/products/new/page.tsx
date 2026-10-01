import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Add Product</h1>

      <div className="mt-6">
        <ProductForm />
      </div>
    </main>
  );
}