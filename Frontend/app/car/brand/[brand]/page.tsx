import { CarGrid } from "@/components/car/car-grid";
import { Header } from "@/components/layout/header";


export default function ToyotaListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mt-6">
          <CarGrid />
        </div>
      </main>
    </div>
  )
}
