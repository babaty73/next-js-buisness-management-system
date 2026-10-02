import Link from "next/link";
import CustomerForm from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/customers"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Customers
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Add Customer
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new customer to your business.
          </p>
        </div>

        <CustomerForm />
      </div>
    </main>
  );
}