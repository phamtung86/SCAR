import { CarDetails } from "@/components/car/car-details";
import { Header } from "@/components/layout/header";



export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return <div className="text-red-500">Invalid car ID</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <CarDetails carId={numericId}  />
      </main>
    </div>
  );
}
