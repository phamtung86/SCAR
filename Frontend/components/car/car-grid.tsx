"use client"

import CarAPI from "@/lib/api/car";
import { CarDTO } from "@/types/car";
import { useEffect, useState } from "react";
import { CarCard } from "../marketplace/car-card";
import { useParams } from "next/navigation";
import Link from "next/link";
export function CarGrid() {

    const { brand } = useParams();
    const [cars, setCars] = useState<CarDTO[]>([]);
    const fetchCarByBrandId = async (brandName: string) => {
        try {
            const res = await CarAPI.getCarsByBrandId(brandName);
            if (res.status === 200) {
                setCars(res.data)
            }
        } catch (error) {
            console.log("Lỗi khi lấy danh sách xe");
        }
    }

    useEffect(() => {
        fetchCarByBrandId(String(brand))
    }, [])

    return (
        <>
            <h1 className="text-3xl font-bold text-foreground mb-2">Xe {brand}</h1>
            <p className="text-muted-foreground mb-8">Khám phá bộ sưu tập xe {brand} chất lượng cao với giá cả hợp lý</p>
            <div className="text-lg text-gray-500 dark:text-gray-400 m-2">
                <Link href={"/"}>Trang chủ</Link> /
                <Link href={"/marketplace"}>Chợ xe</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cars.map((car) => (
                    <CarCard key={car.id} car={car} viewMode="grid" />
                ))}
            </div>
        </>
    )
}
