import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { getCustomer } from "@/services/customerService";
import EditCustomerForm from "@/components/customers/EditCustomerForm";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/customers/${id}`}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Customer
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Edit Customer
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update customer information.
          </p>
        </div>

        <EditCustomerForm
          customer={{
            _id: customer._id.toString(),
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone,
            address: customer.address || "",
          }}
        />
      </div>
    </main>
  );
}