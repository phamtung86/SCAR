"use client"

import { CarCard } from "@/components/marketplace/car-card"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CarAPI from "@/lib/api/car"
import { CarFilterParams } from "@/lib/CarFilterParams"
import { useDebounce } from "@/lib/use-debounce"
import { CarDTO } from "@/types/car"
import { ChevronLeft, ChevronRight, Grid, List, Search, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

export function MarketplaceContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sort, setSort] = useState('')
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearchValue = useDebounce(searchValue, 500) // 500ms delay

  const fetchCars = async (filters: CarFilterParams) => {
    setLoading(true);
    try {
      const response = await CarAPI.getCarsPage(filters);
      if (response.status === 200) {
      
        setCars(response.data.content);
        setTotalItems(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {

    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      fetchCars({ pageNumber, size: itemsPerPage })
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  useEffect(() => {
    fetchCars({ pageNumber: currentPage, size: itemsPerPage, sort })
  }, [])

  useEffect(() => {
    fetchCars({
      pageNumber: 1,
      size: 6,
      search: debouncedSearchValue.trim() || undefined, // nếu rỗng thì truyền undefined
    })
  }, [debouncedSearchValue])


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chợ xe Scar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Tìm kiếm và mua bán xe hơi uy tín, chất lượng</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {totalItems} xe đang bán
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Cập nhật mới nhất
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Tìm kiếm theo hãng xe, model, giá..." className="pl-10 bg-white dark:bg-gray-800" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={sort.toString()}
                onValueChange={(value) => {
                  setSort(value)
                  fetchCars({ pageNumber: 1, size: itemsPerPage, sort: value })
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt,desc">Mới nhất</SelectItem>
                  <SelectItem value="price">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price,desc">Giá cao đến thấp</SelectItem>
                  <SelectItem value="year, desc">Năm sản xuất</SelectItem>
                  <SelectItem value="odo">Số km</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80">
            <MarketplaceFilters showFilters={showFilters} setShowFilters={setShowFilters} fetchCars={fetchCars} />
          </div>
        )}

        {/* Cars Grid/List */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} trong
              tổng số {totalItems} xe
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trang {currentPage} / {totalPages}
            </p>
            {/* Items per page selector (optional) */}
            {/* <div className="mt-4 flex justify-center"> */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Hiển thị:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  const newItemsPerPage = Number.parseInt(value)
                  setCurrentPage(1)
                  setItemsPerPage(newItemsPerPage)
                  fetchCars({ pageNumber: 1, size: newItemsPerPage, sort })
                }}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              <span>xe mỗi trang</span>
            </div>
            {/* </div> */}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {cars.map((car, index) => (
                car?.display === true &&
                <CarCard key={index} car={car} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Button */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trang trước
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {generatePageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        disabled={loading}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center"
              >
                Trang sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
