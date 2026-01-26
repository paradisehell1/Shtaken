'use client'

import { useState, useEffect } from "react"

type PageType = {
  id: number
  title: string
  slug: string
  content: string
  created_at: string
  updated_at: string
}

export default function PagesPage() {
  const [pages, setPages] = useState<PageType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<PageType | null>(null)
  const [form, setForm] = useState({ title: "", slug: "", content: "" })
  const [saving, setSaving] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchPages = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pages/", {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      setPages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const startEdit = (page: PageType) => {
    setEditingPage(page)
    setForm({ title: page.title, slug: page.slug, content: page.content })
  }

  const cancelEdit = () => {
    setEditingPage(null)
    setForm({ title: "", slug: "", content: "" })
  }

  const savePage = async () => {
    if (!token) return
    setSaving(true)
    try {
      const method = editingPage ? "PUT" : "POST"
      const url = editingPage
        ? `http://127.0.0.1:8000/api/pages/${editingPage.id}/`
        : "http://127.0.0.1:8000/api/pages/"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        cancelEdit()
        fetchPages()
      } else {
        const err = await res.json()
        console.error("Error saving page:", err)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deletePage = async (id: number) => {
    if (!token) return
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/pages/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
      if (res.ok) fetchPages()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pages</h1>

      {/* Page Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingPage ? "Edit Page" : "New Page"}</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded bg-white text-gray-900"
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            className="border p-2 rounded bg-white text-gray-900"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="border p-2 rounded bg-white text-gray-900 h-32"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={savePage}
              disabled={saving}
              className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {editingPage && (
              <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pages List */}
      {loading ? (
        <p>Loading pages...</p>
      ) : pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        <div className="grid gap-4">
          {pages.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-gray-500">{p.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePage(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
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
