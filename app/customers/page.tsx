import Link from "next/link";
import { getCustomers } from "@/services/customerService";
import CustomerActions from "@/components/customers/CustomerActions";
export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your customers and their contact information.
            </p>
          </div>

          <Link
            href="/customers/new"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Add Customer
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Customers
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              With Email
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {customers.filter((customer) => customer.email).length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              With Address
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {customers.filter((customer) => customer.address).length}
            </p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Customer Directory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A list of all customers in your business.
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                👥
              </div>

              <h3 className="font-semibold text-gray-900">
                No customers yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first customer to start building your customer
                directory.
              </p>

              <Link
                href="/customers/new"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Add Customer
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Address</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id.toString()}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                         <Link
                            href={`/customers/${customer._id.toString()}`}
                            className="font-medium text-gray-900 hover:underline"
                            >
                            {customer.name}
                            </Link>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {customer.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {customer.address || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <CustomerActions customerId={customer._id.toString()} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}