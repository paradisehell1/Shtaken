"use client"

import { useState, useEffect } from "react"

type MediaFile = {
  id: number
  name: string
  file_url: string | null
}

const isImage = (url: string | null) => {
  if (!url) return false
  return url.match(/\.(png|jpe?g|gif|webp)$/i)
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  // --------------------
  // LOAD MEDIA
  // --------------------
  const fetchMedia = async () => {
    if (!token) return
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/media/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) return

      const data = await res.json()
      setMedia(data)
    } catch (err) {
      console.error("Failed to load media", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // --------------------
  // UPLOAD
  // --------------------
  const handleUpload = async () => {
    if (!file || !token) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", file.name)

    setUploading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/media/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        setFile(null)
        fetchMedia()
      } else {
        const err = await res.json()
        console.error("Upload error:", err)
      }
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setUploading(false)
    }
  }

  // --------------------
  // DELETE
  // --------------------
  const handleDelete = async (id: number) => {
    if (!token) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/media/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id))
      }
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  // --------------------
  // UI
  // --------------------
  return (
    <div className="max-w-6xl mx-auto text-white">

      <h1 className="text-2xl font-bold mb-4">Media Library</h1>

      {/* Upload bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded bg-gray-800 text-white"
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading media...</p>
      ) : media.length === 0 ? (
        <p className="text-gray-400">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map(m => (
            <div
              key={m.id}
              className="bg-gray-800 rounded shadow p-2 flex flex-col"
            >
              {/* Preview */}
              <div className="w-full h-32 bg-gray-700 rounded mb-2 flex items-center justify-center overflow-hidden">

                {isImage(m.file_url) ? (
                  <img
                    src={m.file_url!}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300 text-sm text-center px-2">
                    📄 File
                  </div>
                )}

              </div>

              {/* File name */}
              <div className="flex items-center justify-between gap-2">

                <span
                  className="text-sm truncate flex-1 text-gray-200"
                  title={m.name}
                >
                  {m.name}
                </span>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
