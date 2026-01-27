'use client'

import { useEffect, useState } from "react"
import PageEditor from "./PageEditor" // Импортируем редактор страницы

type PageType = {
  id: number
  title: string
  slug: string
  content: string
  status: "published" | "draft"
  created_at: string
}

export default function PagesPage() {
  const [pages, setPages] = useState<PageType[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [search, setSearch] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [editingPage, setEditingPage] = useState<PageType | null>(null)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    status: "published" as "published" | "draft",
  })

  const [saving, setSaving] = useState(false)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ------------------------
  // FETCH PAGES
  // ------------------------

  const fetchPages = async () => {
    if (!token) return
    setLoading(true)
    let url = "http://127.0.0.1:8000/api/pages/"
    if (filter !== "all") url += `?status=${filter}`
    try {
      const res = await fetch(url, { headers: { Authorization: `Token ${token}` }})
      const data = await res.json()
      setPages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPages() }, [filter])

  // ------------------------
  // SLUG AUTO
  // ------------------------

  const makeSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleTitleChange = (value: string) => {
    setForm({ ...form, title: value, slug: makeSlug(value) })
  }

  // ------------------------
  // ADD PAGE
  // ------------------------

  const savePage = async () => {
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pages/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ title: "", slug: "", content: "", status: "published" })
        setShowForm(false)
        fetchPages()
      } else {
        const err = await res.json()
        console.error("Save error:", err)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  // ------------------------
  // DELETE PAGE
  // ------------------------

  const deletePage = async (id: number) => {
    if (!token || !confirm("Delete this page?")) return
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
        >
          ➕ Add Page
        </button>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 space-y-4">
          <h2 className="text-xl font-semibold">New Page</h2>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="w-full border p-2 rounded bg-white text-gray-900"
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            className="w-full border p-2 rounded bg-white text-gray-900"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full border p-2 rounded bg-white text-gray-900 h-40"
          />

          <div className="flex items-center gap-4">
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
              className="border p-2 rounded bg-white text-gray-900"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <button
              onClick={savePage}
              disabled={saving}
              className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Page"}
            </button>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {(["all", "published", "draft"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "font-semibold" : "text-gray-600"}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? pages.length : pages.filter(p => p.status===f).length})
          </button>
        ))}

        <div className="ml-auto">
          <input
            placeholder="Search pages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded bg-white text-gray-900"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredPages.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-semibold">{p.title}</td>
                <td className="p-3 text-gray-600">{p.slug}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.status === "draft" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                  }`}>{p.status}</span>
                </td>
                <td className="p-3 text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-2">
                  {/* Кнопка перехода в редактор */}
                  <button
                    onClick={() => setEditingPage(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePage(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-auto">
          <div className="bg-white w-full max-w-5xl p-6 rounded shadow-lg">
            <PageEditor page={editingPage} onClose={() => setEditingPage(null)} />
          </div>
        </div>
      )}

    </div>
  )
}
