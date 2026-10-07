"use client"

import { useState } from "react"
import Tabs from "@/components/ui/tabs"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/toaster"

interface Customer {
  id: string
  name: string
  re11: string
  status: "pending" | "processed"
  orders: number
}

const WorkbenchPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "Acme Corp", re11: "RE11001", status: "pending", orders: 5 },
    { id: "2", name: "Global Industries", re11: "RE11002", status: "processed", orders: 3 },
    { id: "3", name: "Tech Solutions", re11: "", status: "pending", orders: 8 },
  ])

  const [isRunningBot, setIsRunningBot] = useState(false)
  const [editingRE11, setEditingRE11] = useState<string | null>(null)
  const [tempRE11, setTempRE11] = useState("")

  const handleEditRE11 = (customerId: string, currentRE11: string) => {
    setEditingRE11(customerId)
    setTempRE11(currentRE11)
  }

  const handleSaveRE11 = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === customerId ? { ...customer, re11: tempRE11 } : customer)),
    )
    setEditingRE11(null)
    toast.success("RE11 number updated successfully")
  }

  const handleCancelEdit = () => {
    setEditingRE11(null)
    setTempRE11("")
  }

  const runPOCreationBot = async () => {
    setIsRunningBot(true)

    // Simulate bot processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setCustomers((prev) =>
      prev.map((customer) => ({
        ...customer,
        status: "processed",
      })),
    )

    setIsRunningBot(false)
    toast.success("PO Creation Bot completed successfully")
  }

  const CustomerTable = ({ title }: { title: string }) => (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <button onClick={runPOCreationBot} disabled={isRunningBot} className="btn-primary flex items-center space-x-2">
          {isRunningBot && <LoadingSpinner size="sm" />}
          <span>{isRunningBot ? "Running Bot..." : "Run PO Creation Bot"}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 text-left font-semibold border border-black">Customer</th>
              <th className="px-4 py-3 text-left font-semibold border border-black">RE11 Number</th>
              <th className="px-4 py-3 text-left font-semibold border border-black">Orders</th>
              <th className="px-4 py-3 text-left font-semibold border border-black">Status</th>
              <th className="px-4 py-3 text-left font-semibold border border-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td className="px-4 py-3 border border-black text-black">{customer.name}</td>
                <td className="px-4 py-3 border border-black">
                  {editingRE11 === customer.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempRE11}
                        onChange={(e) => setTempRE11(e.target.value)}
                        className="input-field text-sm py-1"
                        placeholder="Enter RE11 number"
                      />
                      <button
                        onClick={() => handleSaveRE11(customer.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-black px-2 py-1 rounded text-xs hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-black">{customer.re11 || "Not set"}</span>
                      <button
                        onClick={() => handleEditRE11(customer.id, customer.re11)}
                        className="text-red-600 hover:text-red-700 text-xs transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 border border-black text-black">{customer.orders}</td>
                <td className="px-4 py-3 border border-black">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.status === "processed" ? "status-success" : "status-pending"
                    }`}
                  >
                    {customer.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 border border-black">
                  <button className="text-red-600 hover:text-red-700 text-sm transition-colors">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const SubTabs = () => {
    const subTabs = [
      {
        id: "pending",
        label: "Pending PO Creation",
        content: <CustomerTable title="Pending Purchase Orders" />,
      },
      {
        id: "processed",
        label: "Processed Orders",
        content: <CustomerTable title="Processed Orders" />,
      },
      {
        id: "history",
        label: "Upload History",
        content: (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 text-black">Upload History</h3>
            <p className="text-gray-600">No upload history available</p>
          </div>
        ),
      },
    ]

    return <Tabs tabs={subTabs} />
  }

  const mainTabs = [
    {
      id: "b2b",
      label: "B2B Portal",
      content: <SubTabs />,
    },
    {
      id: "crm",
      label: "CRM Portal",
      content: <SubTabs />,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">PO Creation Workbench</h1>
        <p className="text-gray-600 mt-2">Manage purchase order creation and processing</p>
      </div>

      <Tabs tabs={mainTabs} />
    </div>
  )
}

export default WorkbenchPage
