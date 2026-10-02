import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { getCustomer } from "@/services/customerService";
import CustomerActions from "@/components/customers/CustomerActions";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailsPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/customers"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              ← Back to Customers
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              {customer.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Customer details and contact information.
            </p>
          </div>

          <CustomerActions customerId={customer._id.toString()} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Customer Information
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}