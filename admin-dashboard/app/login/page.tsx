"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/token/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Invalid credentials")
        return
      }

      localStorage.setItem("token", data.auth_token)
      router.push("/dashboard")
    } catch {
      setError("Server error")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 text-white p-10 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Admin Panel</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-700 transition py-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  )
}
