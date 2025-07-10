import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { TrendingContent } from "@/components/trending/trending-content"

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 px-4 py-6">
          <TrendingContent />
        </main>
      </div>
    </div>
  )
}
