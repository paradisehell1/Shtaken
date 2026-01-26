"use client"

import { useState, useEffect } from "react"

type MediaFile = {
  id: number
  name: string
  file_url: string | null
  created_at: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Получаем токен только на клиенте
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchMedia = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/media/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      const data = await res.json()
      setMedia(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async () => {
    if (!file || !token) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", file.name) // обязательно передаем name, чтобы сериализатор не ругался

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
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/media/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      if (res.ok) fetchMedia()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Media Library</h1>

      {/* Upload */}
      <div className="flex gap-2 mb-4">
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded bg-white text-gray-900"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : media.length === 0 ? (
        <p>No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map(m => (
            <div key={m.id} className="bg-white p-2 rounded shadow">
              {m.file_url ? (
                <img
                  src={m.file_url}
                  alt={m.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded mb-2">
                  {m.name}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition text-sm"
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
