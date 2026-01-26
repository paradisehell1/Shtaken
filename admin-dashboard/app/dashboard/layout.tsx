"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    // удаляем токен из localStorage
    localStorage.removeItem("token")
    // редирект на страницу логина
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/dashboard/pages"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            📄 Pages
          </Link>

          <Link
            href="/dashboard/media"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            🖼 Media
          </Link>

          <Link
            href="/dashboard/users"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            👤 Users
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 mt-4 w-full text-left rounded-lg hover:bg-slate-800 transition"
          >
            🔒 Logout
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700 text-sm text-gray-400">
          © 2026 Admin
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
