"use client"

import type React from "react"
import { useState } from "react"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

const Tabs = ({ tabs, defaultTab, className = "" }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex border-b border-black">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-black border-transparent hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
}

export default Tabs
