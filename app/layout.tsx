import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Logistics Management System",
  description: "Enterprise logistics management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <Navigation />
        <main className="pt-16">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
