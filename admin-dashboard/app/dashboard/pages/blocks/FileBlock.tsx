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

export default function FileBlock({ block, onChange, onRemove }: Props) {
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
        const data = await res.json()
        // фильтруем только не-картинки
const nonImageFiles = data.filter((f: MediaFile) =>
  !f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
)
        setMediaFiles(nonImageFiles)
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
        <span className="font-semibold">File Block</span>
        <button onClick={onRemove} className="text-red-500 font-bold">
          Remove
        </button>
      </div>

      <input
        className="w-full border p-1 rounded mb-2 text-black"
        placeholder="File title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Кнопка открытия выбора файла */}
      <button
        onClick={openSelector}
        className="bg-slate-700 text-white px-2 py-1 rounded mb-2"
      >
        Select file
      </button>

      {/* Модальное окно со списком файлов */}
      {showSelector && (
        <div className="border rounded p-2 mb-2 max-h-60 overflow-y-auto bg-gray-50">
          {mediaFiles.length === 0 && <div className="text-gray-500">No files</div>}
          {mediaFiles.map(f => (
            <div
              key={f.id}
              className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
              onClick={() => selectFile(f)}
            >
              {f.name}
            </div>
          ))}
        </div>
      )}

      {/* Превью выбранного файла */}
      {url && (
        <div className="mt-2">
          <a href={url} target="_blank" className="text-blue-600 underline">
            {title || url.split("/").pop()}
          </a>
        </div>
      )}
    </div>
  )
}
