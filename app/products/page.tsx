import { getProducts } from "@/services/productService";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Products</h1>

      {products.length === 0 ? (
        <p className="mt-4">No products found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <div key={product._id.toString()} className="border p-4">
              <h2 className="font-semibold">{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Category: {product.category}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}