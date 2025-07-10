import { Header } from "@/components/layout/header"
import { NotificationsContent } from "@/components/notifications/notifications-content"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <NotificationsContent />
      </main>
    </div>
  )
}
