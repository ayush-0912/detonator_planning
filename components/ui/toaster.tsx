"use client"

import { useState, useEffect } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

let toastQueue: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
}

function addToast(message: string, type: Toast["type"]) {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast = { id, message, type }
  toastQueue.push(newToast)
  listeners.forEach((listener) => listener([...toastQueue]))

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    listeners.forEach((listener) => listener([...toastQueue]))
  }, 5000)
}

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-md border font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-red-50 border-red-200 text-red-800"
              : toast.type === "error"
                ? "bg-red-100 border-red-300 text-red-900"
                : "bg-gray-50 border-gray-200 text-gray-800"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
