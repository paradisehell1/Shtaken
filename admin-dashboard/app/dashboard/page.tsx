import ProtectedRoute from "./ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to admin panel 🚀</p>
    </ProtectedRoute>
  )
}
