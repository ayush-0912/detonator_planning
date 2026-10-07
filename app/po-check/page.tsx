"use client"

import { useState, useMemo } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface PORecord {
  id: string
  customer: string
  poNumber: string
  status: "success" | "failed" | "pending"
  reasonForFailure?: string
  date: string
}

const POCheckPage = () => {
  const [poRecords] = useState<PORecord[]>([
    { id: "1", customer: "Acme Corp", poNumber: "PO-2024-001", status: "success", date: "2024-01-15" },
    {
      id: "2",
      customer: "Global Industries",
      poNumber: "PO-2024-002",
      status: "failed",
      reasonForFailure: "Invalid customer data",
      date: "2024-01-14",
    },
    { id: "3", customer: "Tech Solutions", poNumber: "PO-2024-003", status: "pending", date: "2024-01-13" },
    {
      id: "4",
      customer: "Innovation Ltd",
      poNumber: "PO-2024-004",
      status: "failed",
      reasonForFailure: "Missing RE11 number",
      date: "2024-01-12",
    },
    { id: "5", customer: "Future Corp", poNumber: "PO-2024-005", status: "success", date: "2024-01-11" },
  ])

  const [filters, setFilters] = useState({
    customer: "",
    poNumber: "",
    status: "",
  })

  const [sortConfig, setSortConfig] = useState<{
    key: keyof PORecord
    direction: "asc" | "desc"
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const filteredRecords = useMemo(() => {
    return poRecords.filter((record) => {
      return (
        record.customer.toLowerCase().includes(filters.customer.toLowerCase()) &&
        record.poNumber.toLowerCase().includes(filters.poNumber.toLowerCase()) &&
        (filters.status === "" || record.status === filters.status)
      )
    })
  }, [poRecords, filters])

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return filteredRecords

    return [...filteredRecords].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredRecords, sortConfig])

  const handleSort = (key: keyof PORecord) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "status-success"
      case "failed":
        return "status-failed"
      case "pending":
        return "status-pending"
      default:
        return "status-pending"
    }
  }

  const SortIcon = ({ column }: { column: keyof PORecord }) => {
    if (sortConfig?.key !== column) {
      return <span className="text-gray-400">↕</span>
    }
    return <span className="text-white">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">PO Check Panel</h1>
            <p className="text-gray-600 mt-2">Monitor purchase order status and failures</p>
          </div>
          <button onClick={refreshData} disabled={isLoading} className="btn-primary flex items-center space-x-2">
            {isLoading && <LoadingSpinner size="sm" />}
            <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-black">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Customer</label>
            <input
              type="text"
              value={filters.customer}
              onChange={(e) => handleFilterChange("customer", e.target.value)}
              placeholder="Search by customer name"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">PO Number</label>
            <input
              type="text"
              value={filters.poNumber}
              onChange={(e) => handleFilterChange("poNumber", e.target.value)}
              placeholder="Search by PO number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-black">Purchase Orders ({sortedRecords.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header">
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-red-700 border border-black transition-colors"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Customer</span>
                    <SortIcon column="customer" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-red-700 border border-black transition-colors"
                  onClick={() => handleSort("poNumber")}
                >
                  <div className="flex items-center space-x-2">
                    <span>PO Number</span>
                    <SortIcon column="poNumber" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-red-700 border border-black transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    <SortIcon column="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold border border-black">Reason for Failure</th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-red-700 border border-black transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Date</span>
                    <SortIcon column="date" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record, index) => (
                <tr key={record.id} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td className="px-4 py-3 border border-black font-medium text-black">{record.customer}</td>
                  <td className="px-4 py-3 border border-black text-black">{record.poNumber}</td>
                  <td className="px-4 py-3 border border-black">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-black">
                    {record.status === "failed" && record.reasonForFailure ? (
                      <span className="text-red-700 font-medium">{record.reasonForFailure}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border border-black text-gray-600">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">No purchase orders found matching your criteria</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default POCheckPage
