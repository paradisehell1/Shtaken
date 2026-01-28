"use client"

import { useState, useEffect } from "react"
import { PageBlock } from "@/types"

interface MediaFile {
  id: number
  name: string
  file_url: string
}

interface TableCell {
  type: "text" | "image" | "file"
  value: string
}

interface Props {
  block: PageBlock
  onChange: (content: any) => void
  onRemove: () => void
}

export default function TableBlock({ block, onChange, onRemove }: Props) {
  const [title, setTitle] = useState(block.content?.title || "")
  const [columnTitles, setColumnTitles] = useState(block.content?.columnTitles || ["Column 1"])
  const [table, setTable] = useState<TableCell[][]>(
    block.content?.table?.map((row: any[]) =>
      row.map(cell =>
        typeof cell === "string" ? { type: "text", value: cell } : cell
      )
    ) || [[{ type: "text", value: "" }]]
  )

  const [showSelector, setShowSelector] = useState(false)
  const [currentCell, setCurrentCell] = useState<{
    row: number
    col: number
    type: "image" | "file"
  } | null>(null)

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null

  // ------------------
  // sync with parent
  // ------------------
  useEffect(() => {
    onChange({
      title,
      columnTitles,
      table,
    })
  }, [title, columnTitles, table])

  // ------------------
  // load media
  // ------------------
  const loadMedia = async (type: "image" | "file") => {
    if (!token) return

    const res = await fetch("http://127.0.0.1:8000/api/media/", {
      headers: { Authorization: `Token ${token}` },
    })

    if (!res.ok) return

    const data: MediaFile[] = await res.json()

    const filtered =
      type === "image"
        ? data.filter(f => f.file_url.match(/\.(png|jpe?g|gif)$/i))
        : data

    setMediaFiles(filtered)
    setShowSelector(true)
  }

  const openSelector = (row: number, col: number, type: "image" | "file") => {
    setCurrentCell({ row, col, type })
    loadMedia(type)
  }

  const selectFile = (file: MediaFile) => {
    if (!currentCell) return

    const { row, col, type } = currentCell

    setTable(prev =>
      prev.map((r, rIdx) =>
        rIdx === row
          ? r.map((c, cIdx) =>
              cIdx === col ? { type, value: file.file_url } : c
            )
          : r
      )
    )

    setShowSelector(false)
    setCurrentCell(null)
  }

  // ------------------
  // table controls
  // ------------------
  const addRow = () => {
    setTable(prev => [
      ...prev,
      columnTitles.map(() => ({ type: "text", value: "" })),
    ])
  }

  const deleteRow = (idx: number) => {
    setTable(prev => prev.filter((_, i) => i !== idx))
  }

  const addColumn = () => {
    setColumnTitles(prev => {
      const updated = [...prev, `Column ${prev.length + 1}`]
      setTable(t => t.map(r => [...r, { type: "text", value: "" }]))
      return updated
    })
  }

  const handleCellChange = (r: number, c: number, val: string) => {
    setTable(prev =>
      prev.map((row, ri) =>
        ri === r
          ? row.map((cell, ci) =>
              ci === c ? { ...cell, value: val } : cell
            )
          : row
      )
    )
  }

  const handleCellTypeChange = (
    r: number,
    c: number,
    type: TableCell["type"]
  ) => {
    setTable(prev =>
      prev.map((row, ri) =>
        ri === r
          ? row.map((cell, ci) =>
              ci === c ? { type, value: "" } : cell
            )
          : row
      )
    )
  }

  const getFileName = (url: string) => {
    try {
      return decodeURIComponent(url.split("/").pop() || "")
    } catch {
      return url
    }
  }

  // ------------------
  // UI
  // ------------------
  return (
    <div className="border p-2 rounded bg-gray-700 text-white">

      <div className="flex justify-between mb-2">
        <input
          className="flex-1 bg-gray-600 p-1 rounded"
          placeholder="Table title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          onClick={onRemove}
          className="ml-2 text-red-400 hover:text-red-600"
        >
          Remove
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columnTitles.map((col, i) => (
              <th key={i} className="border bg-gray-800 p-1">
                <input
                  className="w-full bg-gray-800 text-white text-xs"
                  value={col}
                  onChange={e =>
                    setColumnTitles(prev =>
                      prev.map((t, idx) =>
                        idx === i ? e.target.value : t
                      )
                    )
                  }
                />
              </th>
            ))}
            <th className="border bg-gray-800 p-1">Actions</th>
          </tr>
        </thead>

        <tbody>
          {table.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="border p-1 align-top">

                  {cell.type === "text" && (
                    <input
                      className="w-full bg-gray-700 text-white"
                      value={cell.value}
                      onChange={e =>
                        handleCellChange(rIdx, cIdx, e.target.value)
                      }
                    />
                  )}

                  {cell.type === "image" && (
                    <div className="flex flex-col items-center">
                      {cell.value && (
                        <img
                          src={cell.value}
                          className="w-12 h-12 object-cover rounded border mb-1"
                        />
                      )}
                      <button
                        className="bg-gray-600 px-2 py-1 rounded text-xs"
                        onClick={() =>
                          openSelector(rIdx, cIdx, "image")
                        }
                      >
                        +
                      </button>
                    </div>
                  )}

                  {cell.type === "file" && (
                    <div className="flex flex-col items-center text-xs">
                      {cell.value && (
                        <div className="mb-1 truncate max-w-[120px] text-center">
                          {getFileName(cell.value)}
                        </div>
                      )}
                      <button
                        className="bg-gray-600 px-2 py-1 rounded"
                        onClick={() =>
                          openSelector(rIdx, cIdx, "file")
                        }
                      >
                        +
                      </button>
                    </div>
                  )}

                  <select
                    className="bg-gray-600 text-xs w-full mt-1"
                    value={cell.type}
                    onChange={e =>
                      handleCellTypeChange(
                        rIdx,
                        cIdx,
                        e.target.value as TableCell["type"]
                      )
                    }
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="file">File</option>
                  </select>

                </td>
              ))}

              <td className="border p-1 text-center">
                <button
                  onClick={() => deleteRow(rIdx)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 mt-2">
        <button
          onClick={addRow}
          className="bg-gray-600 px-2 py-1 rounded text-xs"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="bg-gray-600 px-2 py-1 rounded text-xs"
        >
          Add Column
        </button>
      </div>

      {/* media selector */}

      {showSelector && (
        <div className="grid grid-cols-4 gap-2 mt-2 max-h-60 overflow-y-auto">
          {mediaFiles.map(f => (
            <div
              key={f.id}
              className="cursor-pointer border rounded hover:border-blue-500 p-1"
              onClick={() => selectFile(f)}
            >
              {currentCell?.type === "image" && (
                <img
                  src={f.file_url}
                  className="w-full h-20 object-cover rounded"
                />
              )}
              <div className="text-xs text-center truncate">
                {f.name}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
