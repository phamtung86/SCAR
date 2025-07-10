import { NewsFeed } from "@/components/home/news-feed"
import { Header } from "@/components/layout/header"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { Sidebar } from "@/components/layout/sidebar"
import { useEffect } from "react"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 px-4 py-6">
          <NewsFeed />
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
