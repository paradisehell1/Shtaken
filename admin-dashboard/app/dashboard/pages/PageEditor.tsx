"use client"

import { useState } from "react"
import { PageType, PageBlock } from "@/types"

import TextBlock from "./blocks/TextBlock"
import ImageBlock from "./blocks/ImageBlock"
import FileBlock from "./blocks/FileBlock"
import TableBlock from "./blocks/TableBlock"

interface Props {
  page: PageType | null
  onClose: () => void
  onSaved?: () => void
}

export default function PageEditor({ page, onClose, onSaved }: Props) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ---------------- PAGE STATE ----------------
  const [title, setTitle] = useState(page?.title || "")
  const [slug, setSlug] = useState(page?.slug || "")
  const [status, setStatus] = useState<PageType["status"]>(page?.status || "draft")
  const [saving, setSaving] = useState(false)

  // ---------------- DRAG STATE ----------------
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  // ---------------- BLOCKS STATE ----------------
  const [blocks, setBlocks] = useState<PageBlock[]>(
    page?.blocks?.map(b => {
      if (b.block_type === "table") {
        return {
          ...b,
          type: "table",
          title: b.content?.title || "",
          content: {
            title: b.content?.title || "",
            columnTitles: b.content?.columnTitles || ["Column 1"],
            table: b.content?.table || [[""]],
          },
          page: page?.id,
        }
      }

      if (b.block_type === "image" || b.block_type === "file") {
        return {
          ...b,
          type: b.block_type,
          title: b.content?.title || "",
          content: b.content || {},
          page: page?.id,
        }
      }

      return {
        ...b,
        type: "text",
        title: b.title || "",
        content:
          typeof b.content === "string"
            ? { title: b.title || "", text: b.content }
            : { title: b.title || b.content?.title || "", text: b.content?.text || "" },
        page: page?.id,
      }
    }) || []
  )

  // ---------------- MOVE BLOCK ----------------
  const moveBlock = (from: number, to: number) => {
    setBlocks(prev => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  // ---------------- ADD BLOCK ----------------
  const addBlock = (type: PageBlock["type"]) => {
    setBlocks(prev => [
      ...prev,
      {
        id: undefined,
        tempId: crypto.randomUUID(),
        type,
        title: "",
        content:
          type === "text"
            ? { title: "", text: "" }
            : type === "table"
            ? { title: "", columnTitles: ["Column 1"], table: [[""]] }
            : {},
        page: page?.id,
      },
    ])
  }

  // ---------------- UPDATE BLOCK ----------------
  const updateBlock = (id?: number, tempId?: string, content?: any) => {
    setBlocks(prev =>
      prev.map(b =>
        (b.id && b.id === id) || (b.tempId && b.tempId === tempId)
          ? { ...b, content, title: content?.title || "" }
          : b
      )
    )
  }

  // ---------------- DELETE BLOCK ----------------
  const deleteBlock = async (block: PageBlock) => {
    if (!token) return

    try {
      if (block.id) {
        await fetch(`http://127.0.0.1:8000/api/blocks/${block.id}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        })
      }

      setBlocks(prev => prev.filter(b => b !== block))
    } catch {
      alert("Delete failed")
    }
  }

  // ---------------- SAVE PAGE ----------------
  const savePage = async () => {
    if (!token) return
    setSaving(true)

    try {
      const url = page
        ? `http://127.0.0.1:8000/api/pages/${page.id}/`
        : `http://127.0.0.1:8000/api/pages/`

      const normalizedBlocks = blocks.map((b, index) => {
        if (b.type === "text") {
          return {
            id: b.id,
            block_type: "text",
            title: b.title || "",
            content: { text: b.content?.text || "" },
            order: index,
            page: page?.id,
          }
        }

        if (b.type === "table") {
          return {
            id: b.id,
            block_type: "table",
            title: b.content?.title || "",
            content: {
              title: b.content?.title || "",
              columnTitles: b.content?.columnTitles || ["Column 1"],
              table: b.content?.table || [[""]],
            },
            order: index,
            page: page?.id,
          }
        }

        return {
          id: b.id,
          block_type: b.type,
          title: b.title || "",
          content: b.content || {},
          order: index,
          page: page?.id,
        }
      })

      const res = await fetch(url, {
        method: page ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ title, slug, status, blocks: normalizedBlocks }),
      })

      if (!res.ok) {
        console.error(await res.json())
        alert("Save failed")
        return
      }

      onSaved?.()
      onClose()
      window.location.reload()
    } catch {
      alert("Save error")
    } finally {
      setSaving(false)
    }
  }

  // ---------------- RENDER BLOCK ----------------
  const renderBlock = (block: PageBlock) => {
    const Comp =
      block.type === "text"
        ? TextBlock
        : block.type === "image"
        ? ImageBlock
        : block.type === "file"
        ? FileBlock
        : TableBlock

    return (
      <Comp
        block={block}
        onChange={c => updateBlock(block.id, block.tempId, c)}
        onRemove={() => deleteBlock(block)}
      />
    )
  }

  // ---------------- UI ----------------
  return (
    <div className="bg-gray-900 p-4 rounded shadow max-w-5xl mx-auto text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{page ? "Edit Page" : "New Page"}</h2>
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          Close
        </button>
      </div>

      {/* PAGE META */}
      <input
        className="w-full bg-gray-800 border border-gray-700 p-2 mb-2 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        className="w-full bg-gray-800 border border-gray-700 p-2 mb-2 rounded"
        placeholder="Slug"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />

      <select
        className="bg-gray-800 border border-gray-700 p-2 mb-4 rounded"
        value={status}
        onChange={e => setStatus(e.target.value as PageType["status"])}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      {/* ADD BUTTONS */}
      <div className="flex gap-2 mb-4">
        {["text", "image", "file", "table"].map(t => (
          <button
            key={t}
            onClick={() => addBlock(t as any)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Add {t}
          </button>
        ))}
      </div>

      {/* BLOCKS */}
      <div className="flex flex-col gap-3 mb-4">
        {blocks.map((b, index) => (
          <div
            key={b.id || b.tempId}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return
              moveBlock(dragIndex, index)
              setDragIndex(null)
            }}
            className="bg-gray-800 border border-gray-700 rounded p-2 cursor-move hover:border-blue-500 transition"
          >
            <div className="text-xs text-gray-400 mb-1">Drag to reorder</div>
            {renderBlock(b)}
          </div>
        ))}
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          disabled={saving}
          onClick={savePage}
          className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>
    </div>
  )
}
