import { CommunityContent } from "@/components/community/community-content";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";


export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 px-4 py-6">
          <CommunityContent />
        </main>
      </div>
    </div>
  )
}
