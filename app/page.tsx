"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Tabs from "@/components/ui/tabs"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/toaster"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "pending" | "uploading" | "success" | "error"
}

const DataUploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "pending",
    }))
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUpload = async () => {
    setIsUploading(true)

    // Simulate upload process
    for (const file of files) {
      if (file.status === "pending") {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" } : f)))

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate success/failure
        const success = Math.random() > 0.2
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: success ? "success" : "error" } : f)))
      }
    }

    setIsUploading(false)
    toast.success("Upload process completed")
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const FileUploadArea = () => (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-black">Drop files here or click to browse</p>
            <p className="text-gray-600 mt-1">Supports CSV, Excel, and text files</p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".csv,.xlsx,.xls,.txt"
          />
          <label htmlFor="file-upload" className="btn-secondary cursor-pointer inline-block">
            Select Files
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Selected Files</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="flex-1">
                  <p className="font-medium text-black">{file.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {file.status === "uploading" && <LoadingSpinner size="sm" />}
                  {file.status === "success" && <span className="text-red-600 font-bold">✓</span>}
                  {file.status === "error" && <span className="text-red-600 font-bold">✗</span>}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-black transition-colors"
                    disabled={file.status === "uploading"}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading || files.every((f) => f.status !== "pending")}
              className="btn-primary flex items-center space-x-2"
            >
              {isUploading && <LoadingSpinner size="sm" />}
              <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const tabs = [
    {
      id: "b2b",
      label: "B2B Upload",
      content: <FileUploadArea />,
    },
    {
      id: "crm",
      label: "CRM Upload",
      content: <FileUploadArea />,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Data Upload Portal</h1>
        <p className="text-gray-600 mt-2">Upload your B2B and CRM data files for processing</p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  )
}

export default DataUploadPage
