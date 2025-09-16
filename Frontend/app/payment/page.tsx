
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PaymentFeesPage } from "@/components/payment/payment-fee";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
          <Header />
          <div className="flex max-w-7xl mx-auto">
            <Sidebar />
            <main className="flex-1 px-0 py-4 ">
              <PaymentFeesPage />
            </main>
          </div>
        </div>
      )
}
