import { Header } from "@/components/layout/header"
import FullCarChatApp from "@/components/messages/messages-content"
import { Suspense } from "react"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
       <Suspense fallback={<div>Loading...</div>}>
        <FullCarChatApp />
      </Suspense>
    </div>
  )
}
