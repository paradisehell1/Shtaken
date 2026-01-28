"use client"

import { useState, useEffect } from "react"
import { PageBlock } from "@/types"

interface MediaFile {
  id: number
  name: string
  file_url: string
}

interface Props {
  block: PageBlock
  onChange: (content: { title?: string; text?: string }) => void
  onRemove: () => void
}

export default function ImageBlock({ block, onChange, onRemove }: Props) {
  const [title, setTitle] = useState(block.content?.title || "")
  const [url, setUrl] = useState(block.content?.text || "")
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [showSelector, setShowSelector] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // синхронизация с родителем
  useEffect(() => {
    onChange({ title, text: url })
  }, [title, url])

  // загрузка файлов с сервера
  const loadMedia = async () => {
    if (!token) return
    try {
      const res = await fetch("http://127.0.0.1:8000/api/media/", {
        headers: { Authorization: `Token ${token}` },
      })
      if (res.ok) {
        const data: MediaFile[] = await res.json()
        // фильтруем только изображения по расширению
        const images = data.filter(f =>
          f.file_url?.match(/\.(png|jpe?g|gif)$/i)
        )
        setMediaFiles(images)
      }
    } catch (err) {
      console.error("Failed to load media files", err)
    }
  }

  const openSelector = () => {
    loadMedia()
    setShowSelector(true)
  }

  const selectFile = (file: MediaFile) => {
    setUrl(file.file_url)
    setShowSelector(false)
  }

  return (
    <div className="border p-2 rounded mb-2 bg-white">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Image Block</span>
        <button onClick={onRemove} className="text-red-500 font-bold">
          Remove
        </button>
      </div>

      <input
        className="w-full border p-1 rounded mb-2 text-black"
        placeholder="Image title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Кнопка открытия выбора файла */}
      <button
        onClick={openSelector}
        className="bg-slate-700 text-white px-2 py-1 rounded mb-2"
      >
        Select from media
      </button>

      {/* Галерея миниатюр */}
      {showSelector && (
        <div className="grid grid-cols-4 gap-2 mb-2 max-h-60 overflow-y-auto">
          {mediaFiles.map(f => (
            <div
              key={f.id}
              className="cursor-pointer border rounded hover:border-blue-500"
              onClick={() => selectFile(f)}
            >
              <img src={f.file_url} alt={f.name} className="w-full h-20 object-cover rounded" />
              <div className="text-xs text-center truncate px-1">{f.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Превью выбранного изображения */}
      {url && (
        <div className="mt-2">
          <img src={url} alt={title} className="max-w-full rounded border" />
        </div>
      )}
    </div>
  )
}
