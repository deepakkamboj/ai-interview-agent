"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react"

interface DocumentUploadProps {
  onCVUpload: (content: string) => void
  onJobPostingUpload: (content: string) => void
}

interface UploadState {
  isDragging: boolean
  isLoading: boolean
  progress: number
}

export function DocumentUpload({ onCVUpload, onJobPostingUpload }: DocumentUploadProps) {
  const [cvState, setCvState] = useState<UploadState>({ isDragging: false, isLoading: false, progress: 0 })
  const [jobPostingState, setJobPostingState] = useState<UploadState>({
    isDragging: false,
    isLoading: false,
    progress: 0,
  })

  const [cvUploaded, setCvUploaded] = useState(false)
  const [jobPostingUploaded, setJobPostingUploaded] = useState(false)
  const [cvName, setCvName] = useState("")
  const [jobPostingName, setJobPostingName] = useState("")
  const [cvSize, setCvSize] = useState("")
  const [jobPostingSize, setJobPostingSize] = useState("")
  const [cvError, setCvError] = useState("")
  const [jobPostingError, setJobPostingError] = useState("")

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleCVUpload = async (file: File) => {
    setCvError("")
    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      setCvError("File size exceeds 10MB limit")
      return
    }

    setCvState({ isDragging: false, isLoading: true, progress: 0 })

    try {
      let progressValue = 0
      const progressInterval = setInterval(() => {
        progressValue = Math.min(progressValue + Math.random() * 30, 90)
        setCvState({ isDragging: false, isLoading: true, progress: progressValue })
      }, 100)

      const text = await file.text()
      clearInterval(progressInterval)

      onCVUpload(text)
      setCvUploaded(true)
      setCvName(file.name)
      setCvSize(formatFileSize(file.size))

      setCvState({ isDragging: false, isLoading: false, progress: 100 })

      setTimeout(() => {
        setCvState({ isDragging: false, isLoading: false, progress: 0 })
      }, 500)
    } catch (error) {
      console.error("Error reading CV file:", error)
      setCvError(`Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`)
      setCvState({ isDragging: false, isLoading: false, progress: 0 })
    }
  }

  const handleJobPostingUpload = async (file: File) => {
    setJobPostingError("")
    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      setJobPostingError("File size exceeds 10MB limit")
      return
    }

    setJobPostingState({ isDragging: false, isLoading: true, progress: 0 })

    try {
      let progressValue = 0
      const progressInterval = setInterval(() => {
        progressValue = Math.min(progressValue + Math.random() * 30, 90)
        setJobPostingState({ isDragging: false, isLoading: true, progress: progressValue })
      }, 100)

      const text = await file.text()
      clearInterval(progressInterval)

      onJobPostingUpload(text)
      setJobPostingUploaded(true)
      setJobPostingName(file.name)
      setJobPostingSize(formatFileSize(file.size))

      setJobPostingState({ isDragging: false, isLoading: false, progress: 100 })

      setTimeout(() => {
        setJobPostingState({ isDragging: false, isLoading: false, progress: 0 })
      }, 500)
    } catch (error) {
      console.error("Error reading Job Posting file:", error)
      setJobPostingError(`Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`)
      setJobPostingState({ isDragging: false, isLoading: false, progress: 0 })
    }
  }

  const handleClearCV = () => {
    setCvUploaded(false)
    setCvName("")
    setCvSize("")
    setCvError("")
    onCVUpload("")
  }

  const handleClearJobPosting = () => {
    setJobPostingUploaded(false)
    setJobPostingName("")
    setJobPostingSize("")
    setJobPostingError("")
    onJobPostingUpload("")
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* CV Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
            cvState.isDragging ? "border-blue-500 bg-blue-50" : "border-border bg-muted/30 hover:border-blue-400"
          } ${cvError ? "border-red-300 bg-red-50" : ""}`}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setCvState((prev) => ({ ...prev, isDragging: true }))
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setCvState((prev) => ({ ...prev, isDragging: false }))
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setCvState((prev) => ({ ...prev, isDragging: false }))
            if (e.dataTransfer.files?.[0]) {
              handleCVUpload(e.dataTransfer.files[0])
            }
          }}
          onClick={() => {
            const input = document.getElementById("cv-input") as HTMLInputElement
            input?.click()
          }}
        >
          {!cvUploaded && !cvState.isLoading && (
            <label className="flex flex-col items-center justify-center gap-3 pointer-events-none text-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Upload Your CV</p>
                <p className="text-xs text-muted-foreground">PDF or TXT file</p>
                <p className="text-xs text-muted-foreground mt-2">or drag and drop</p>
              </div>
            </label>
          )}

          {cvState.isLoading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${cvState.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">Uploading... {Math.round(cvState.progress)}%</p>
            </div>
          )}

          {cvUploaded && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 truncate">{cvName}</p>
                <p className="text-xs text-green-600">{cvSize}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearCV()
                }}
                className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors flex-shrink-0"
                title="Remove file"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          {cvError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{cvError}</p>
            </div>
          )}

          <input
            id="cv-input"
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleCVUpload(e.target.files[0])
              }
            }}
            className="hidden"
          />
        </div>

        {/* Job Posting Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
            jobPostingState.isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-border bg-muted/30 hover:border-blue-400"
          } ${jobPostingError ? "border-red-300 bg-red-50" : ""}`}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setJobPostingState((prev) => ({ ...prev, isDragging: true }))
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setJobPostingState((prev) => ({ ...prev, isDragging: false }))
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setJobPostingState((prev) => ({ ...prev, isDragging: false }))
            if (e.dataTransfer.files?.[0]) {
              handleJobPostingUpload(e.dataTransfer.files[0])
            }
          }}
          onClick={() => {
            const input = document.getElementById("job-posting-input") as HTMLInputElement
            input?.click()
          }}
        >
          {!jobPostingUploaded && !jobPostingState.isLoading && (
            <label className="flex flex-col items-center justify-center gap-3 pointer-events-none text-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Upload Job Posting</p>
                <p className="text-xs text-muted-foreground">PDF or TXT file</p>
                <p className="text-xs text-muted-foreground mt-2">or drag and drop</p>
              </div>
            </label>
          )}

          {jobPostingState.isLoading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${jobPostingState.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">Uploading... {Math.round(jobPostingState.progress)}%</p>
            </div>
          )}

          {jobPostingUploaded && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 truncate">{jobPostingName}</p>
                <p className="text-xs text-green-600">{jobPostingSize}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearJobPosting()
                }}
                className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors flex-shrink-0"
                title="Remove file"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          {jobPostingError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{jobPostingError}</p>
            </div>
          )}

          <input
            id="job-posting-input"
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleJobPostingUpload(e.target.files[0])
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  )
}
