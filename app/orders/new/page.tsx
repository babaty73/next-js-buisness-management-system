import OrderForm from "@/components/orders/OrderForm";

export default function NewOrderPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <OrderForm />
      </div>
    </main>
  );
}