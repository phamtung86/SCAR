"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import BrandAPI from "@/lib/api/brand"
import CarAPI from "@/lib/api/car"
import { CarUtils } from "@/lib/utils/car-ultils"
import { CarFilterParams } from "@/lib/CarFilterParams"

export function MarketplaceFilters({
  showFilters,
  setShowFilters,
  fetchCars,
}: {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  fetchCars: (filters: CarFilterParams) => void
}) {
  const [priceRange, setPriceRange] = useState([0, 5000000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedFuelType, setSelectedFuelType] = useState<string | undefined>()
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([])
  const [transmissions, setTransmissions] = useState<{ value: string; label: string }[]>([])
  const [conditions, setConditions] = useState<{ value: string; label: string }[]>([])
  const [fuelTypes, setFuelTypes] = useState<{ value: string; label: string }[]>([])

  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"]

  useEffect(() => {
    const fetchInitialData = async () => {
      const [brandRes, fuelRes, conditionRes, transmissionRes] = await Promise.all([
        BrandAPI.getBrands(),
        CarAPI.getFuelTypes(),
        CarAPI.getConditions(),
        CarAPI.getTransmissions(),
      ])

      if (brandRes.status === 200) setBrands(brandRes.data)
      if (fuelRes.status === 200) setFuelTypes(fuelRes.data)
      if (conditionRes.status === 200) setConditions(conditionRes.data)
      if (transmissionRes.status === 200) setTransmissions(transmissionRes.data)
    }

    fetchInitialData()
  }, [])

  const handleApplyFilters = () => {
    const selectedBrand = brands.find((b) => selectedBrands.includes(b.name))
    const selectedYear = selectedYears.length > 0 ? parseInt(selectedYears[0]) : undefined

    fetchCars({
      pageNumber: 1,
      size: 6,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      brand: selectedBrand?.id,
      year: selectedYear,
      fuelType: selectedFuelType,
      transmission: selectedTransmissions[0],
      condition: selectedConditions[0],
    })
  }

  const handleClearFilters = () => {
    setPriceRange([0, 5000000000])
    setSelectedBrands([])
    setSelectedYears([])
    setSelectedFuelType(undefined)
    setSelectedTransmissions([])
    setSelectedConditions([])
    fetchCars({
      pageNumber: 1,
      size: 6,
    })
  }

  return (
    <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bộ lọc tìm kiếm
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3">Khoảng giá</h3>
          <Slider value={priceRange} onValueChange={setPriceRange} max={5000000000} step={100000000} className="mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{(priceRange[0] / 1000000000).toFixed(1)}B VNĐ</span>
            <span>{(priceRange[1] / 1000000000).toFixed(1)}B VNĐ</span>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-semibold mb-3">Hãng xe</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.name}
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={(checked) => {
                      setSelectedBrands(checked ? [brand.name] : [])
                    }}
                  />

                  <label htmlFor={brand.name} className="text-sm cursor-pointer">
                    {brand.name}
                  </label>
                </div>
                <Badge variant="secondary" className="text-xs"></Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <h3 className="font-semibold mb-3">Năm sản xuất</h3>
          <div className="grid grid-cols-2 gap-2">
            {years.map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox
                  id={year}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={(checked) => {
                    setSelectedYears(checked ? [year] : [])
                  }}
                />

                <label htmlFor={year} className="text-sm cursor-pointer">
                  {year}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <h3 className="font-semibold mb-3">Loại nhiên liệu</h3>
          <div className="space-y-2">
            {fuelTypes.map((fuel) => (
              <div key={fuel.value} className="flex items-center space-x-2">
                <Checkbox
                  id={fuel.value}
                  checked={selectedFuelType === fuel.value}
                  onCheckedChange={(checked) => {
                    setSelectedFuelType(checked ? fuel.value : undefined)
                  }}
                />

                <label htmlFor={fuel.value} className="text-sm cursor-pointer">
                  {CarUtils.changeFuelType(fuel.value)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <h3 className="font-semibold mb-3">Hộp số</h3>
          <div className="space-y-2">
            {transmissions.map((trans) => (
              <div key={trans.value} className="flex items-center space-x-2">
                <Checkbox
                  id={trans.value}
                  checked={selectedTransmissions.includes(trans.value)}
                  onCheckedChange={(checked) => {
                    setSelectedTransmissions(checked ? [trans.value] : [])
                  }}
                />

                <label htmlFor={trans.value} className="text-sm cursor-pointer">
                  {CarUtils.changeTransmission(trans.value)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <h3 className="font-semibold mb-3">Tình trạng</h3>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <Checkbox
                  id={condition.value}
                  checked={selectedConditions.includes(condition.value)}
                  onCheckedChange={(checked) => {
                    setSelectedConditions(checked ? [condition.value] : [])
                  }}
                />
                <label htmlFor={condition.value} className="text-sm cursor-pointer">
                  {CarUtils.changeCarCondition(condition.value)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <Button className="flex-1" onClick={handleApplyFilters}>
            Áp dụng
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
