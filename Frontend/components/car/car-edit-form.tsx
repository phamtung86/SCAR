"use client"

import type React from "react"
import { useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Car, DollarSign, History, MapPin, Plus, Settings, Upload, X, Edit } from "lucide-react"
import { useState } from "react"
import { CarDTO, CarFeatures, CarHistories, CarImages } from "@/types/car"
import BrandAPI from "@/lib/api/brand"
import CarModelAPI from "@/lib/api/car-models"
import CarTypesAPI from "@/lib/api/car-types"
import CarAPI from "@/lib/api/car"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import CarFeatureAPI from "@/lib/api/car-feature"
import CarHistoriesAPI from "@/lib/api/car-history"
import CarImagesAPI from "@/lib/api/car-image"

export default function CarEditForm({
  car,
  onCancel,
  onRefresh
}: {
  car?: CarDTO
  onCancel?: () => void
  onRefresh?: (id: number) => void
}) {
  const [formData, setFormData] = useState<CarDTO | undefined>(car)
  const [images, setImages] = useState<CarImages[]>(formData?.carImages ?? [])
  const [historyEvents, setHistoryEvents] = useState<CarHistories[]>(formData?.carHistories ?? [])
  const [carFeatures, setCarFeatures] = useState<CarFeatures[]>(
    formData?.carFeatures ?? []
  )

  const [imagePreviews, setImagePreviews] = useState([])
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([])
  const [carModels, setCarModels] = useState<{ id: number; name: string }[]>([])
  const [carTypes, setCarTypes] = useState<{ id: number; name: string }[]>([])
  const [isVerify, setIsVerify] = useState(true)

  const [newImages, setNewImages] = useState<File[]>([])
  const [newHistories, setNewHistories] = useState<CarHistories[]>([])
  const [newFeatures, setNewFeatures] = useState<CarFeatures[]>([])

  const fetchDataBrands = async () => {
    try {
      const response = await BrandAPI.getBrands();
      if (response.status === 200) {
        setBrands(response.data);
      } else {
        console.error("Failed to fetch brands:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  const fetchCarById = async (id: number) => {
    try {
      const res = await CarAPI.getCarById(id)
      if (res.status === 200) {
        setFormData(res.data)
        setImages(res.data.carImages)
        setCarFeatures(res.data.carFeatures)
        setHistoryEvents(res.data.carHistories)
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu xe ", error);

    }
  }

  const fetchCarModelsByBrandId = async (brandId: number, carTypeId: number) => {
    try {
      const response = await CarModelAPI.getCarModelsByBrandIdAnhCarTypeId(brandId, carTypeId);
      if (response.status === 200) {
        setCarModels(response.data);
      } else {
        console.error("Failed to fetch car models:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  }

  // Gọi hàm fetchDataBrands khi component được mount
  useEffect(() => {
    // fetchCarById(Number(car?.id))
    fetchDataBrands();
    fetchCarTypes();
    fetchCarModelsByBrandId(Number(car?.carModelsBrandId), Number(car?.carModelsCarTypeId))
  }, []);
  const fetchCarTypes = async () => {
    try {
      const response = await CarTypesAPI.getAllCarTypes();
      if (response.status === 200) {
        setCarTypes(response.data);
      } else {
        console.error("Failed to fetch car types:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching car types:", error);
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    }

    setFormData(updatedFormData)

    const brandId = Number(updatedFormData.carModelsBrandId)
    const carTypeId = Number(updatedFormData.carModelsCarTypeId)

    if (field === "carModelsCarTypeId" || field === "carModelsBrandId") {
      if (brandId && carTypeId) {
        fetchCarModelsByBrandId(brandId, carTypeId)
      } else {
        setCarModels([])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = new FormData()

    const carData = {
      title: formData?.title,
      description: formData?.description,
      year: formData?.year,
      price: formData?.price,
      originalPrice: formData?.originalPrice,
      odo: formData?.odo,
      color: formData?.color,
      location: formData?.location,
      seatNumber: formData?.seatNumber,
      doorNumber: formData?.doorNumber,
      engine: formData?.engine,
      driveTrain: formData?.driveTrain,
      fuelType: formData?.fuelType,
      transmission: formData?.transmission,
      condition: formData?.condition,
      carModelsId: formData?.carModelsId,
      carModelsBrandId: formData?.carModelsBrandId,
      carModelsCarTypeId: formData?.carModelsCarTypeId,
      highLight: formData?.isHighLight,
      feature: formData?.isFeature,
    }

    // const filteredCarFeatures = carFeatures?.map((feature) => ({
    //   name: feature.name,
    //   id: feature.id,
    // }))

    // const filteredCarHistories = historyEvents?.map((history: any) => ({
    //   id: history.id,
    //   eventDate: history.eventDate,
    //   description: history.description,
    // }))

    newImages.forEach((image) => {
      if (image instanceof File) {
        form.append("carImages", image)
      } else {
        console.log("image loi");

        console.warn("Invalid image skipped", image)
      }
    })

    form.append("carData", JSON.stringify(carData))
    form.append("carFeatures", JSON.stringify(newFeatures))
    form.append("carHistories", JSON.stringify(newHistories))

    form.forEach((value, key) => {
      console.log(key + ":", value);
    });
    try {
      // console.log("Updating car with data:", carData)
      // console.log("Updating car with data:", newFeatures)
      // console.log("Updating car with data:", newHistories)
      // console.log("Updating car with data:", newImages)

      const res = await CarAPI.updateCar(form, Number(car?.id))
      if (res.status === 200) {
        alert("Cập nhật thông tin xe thành công!")
        if (onCancel) {
          onRefresh?.(Number(getCurrentUser()?.id))
          onCancel()
        }
      }
    } catch (error: any) {
      console.log("Error updating car:", error)
      alert("Đã xảy ra lỗi khi cập nhật thông tin xe. Vui lòng thử lại sau.")
    }
  }

  const addHistoryEvent = () => {
    const newEvent: CarHistories = {
      id: historyEvents.length + 1,
      carId: Number(car?.id),
      carTitle: String(car?.title),
      eventDate: "",
      description: "",
    }

    setHistoryEvents((prev) => [...prev, newEvent])
    setNewHistories((prev) => [...prev, newEvent])
  }


  const addCarFeature = () => {
    const newFeature = {
      id: carFeatures.length + 1,
      name: "",
      carId: Number(car?.id),
      carTitle: String(car?.title),
    }
    setCarFeatures([...carFeatures, newFeature])
    setNewFeatures((prev) => [...prev, newFeature])
  }
  const removeCarFeature = async (id: number) => {
    if (carFeatures.length >= 1) {
      const res = await CarFeatureAPI.deleteCarFeatureById(id);
      if (res.status === 200) {
        setCarFeatures(carFeatures.filter((feature) => feature.id !== id))
        setNewFeatures(newFeatures.filter((feature) => feature.id !== id))
      }
    }
  }
  const handleCarFeatureChange = (id: number, field: string, value: string) => {
    setCarFeatures(carFeatures.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)))
    setNewFeatures(newFeatures.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)))
  }

  const removeHistoryEvent = async (id: number) => {
    if (historyEvents.length >= 1) {
      const res = await CarHistoriesAPI.deleteCarHistoryById(id);
      if (res.status === 200) {
        setHistoryEvents(historyEvents.filter((event: any) => event.id !== id))
        setNewHistories(newHistories.filter((event: any) => event.id !== id))
      }
    }
  }

  const handleHistoryChange = (id: number, field: string, value: string) => {
    setHistoryEvents(historyEvents.map((event: any) => (event.id === id ? { ...event, [field]: value } : event)))
    setNewHistories(newHistories.map((event: any) => (event.id === id ? { ...event, [field]: value } : event)))
  }

  const removeImageOriginal = async (index: number, id: number) => {
    // Clean up the URL for the removed image
    const res = await CarImagesAPI.deleteCarImageById(id);
    if (res.status === 200) {

      URL.revokeObjectURL(imagePreviews[index])

      const newImages = images.filter((_, i) => i !== index)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)

      setImages(newImages)
      setImagePreviews(newPreviews)
      setNewImages(newPreviews)
    }
  }
  const removeImageNew = async (index: number) => {
    // Clean up the URL for the removed image
      URL.revokeObjectURL(imagePreviews[index])

      const newImages = images.filter((_, i) => i !== index)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)

      setImages(newImages)
      setImagePreviews(newPreviews)
      setNewImages(newPreviews)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      // gộp ảnh cũ + mới
      const arrOldImg = [...images, ...files].slice(0, 10)
      const newImg = [...newImages, ...files].slice(0, 10)

      // Clean up old preview URLs
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))

      // Create new preview URLs
      const newPreviews = newImg.map((file) => URL.createObjectURL(file))

      setImages(arrOldImg)
      setImagePreviews(newPreviews)
      setNewImages((prev) => [...prev, ...files].slice(0, 10))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, 10)

      // Clean up old blob URLs
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })

      const existingPreviews = imagePreviews.filter((_, i) => i < images.length)
      const newFilePreviews = files.map((file) => URL.createObjectURL(file))
      const allPreviews = [...existingPreviews, ...newFilePreviews].slice(0, 10)

      setImages(newImages)
      setImagePreviews(allPreviews)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Edit className="h-6 w-6" />
          Chỉnh sửa thông tin xe
        </h2>
        <p className="text-gray-600">Cập nhật thông tin chi tiết để thu hút nhiều người mua hơn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
            <CardDescription>Nhập thông tin cơ bản về chiếc xe của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề tin đăng *</Label>
                <Input
                  id="title"
                  placeholder="VD: Toyota Camry 2020 - Xe đẹp, giá tốt"
                  value={formData?.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Năm sản xuất *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2020"
                  min="1990"
                  max="2025"
                  value={formData?.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea
                id="description"
                placeholder="Mô tả tình trạng xe, lịch sử sử dụng, các trang bị đặc biệt..."
                rows={4}
                value={formData?.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại xe *</Label>
                <Select
                  value={String(formData?.carModelsCarTypeId)}
                  onValueChange={(value) => handleInputChange("carModelsCarTypeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="carModel">Hãng *</Label>
                <Select
                  value={formData?.carModelsBrandId?.toString()}
                  onValueChange={(value) => handleInputChange("carModelsBrandId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="">Dòng xe *</Label>
                <Select value={String(formData?.carModelsId)} onValueChange={(value) => handleInputChange("carModelsId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dòng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Thông số kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine">Động cơ *</Label>
                <Input
                  id="engine"
                  type="text"
                  placeholder="1.5L Turbo, V6, 2.0L Hybrid,..."
                  value={formData?.engine}
                  onChange={(e) => handleInputChange("engine", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Loại nhiên liệu *</Label>
                <Select value={formData?.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhiên liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GASOLINE">Xăng</SelectItem>
                    <SelectItem value="DIESEL">Dầu diesel</SelectItem>
                    <SelectItem value="ELECTRIC">Điện</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Hộp số *</Label>
                <Select
                  value={formData?.transmission}
                  onValueChange={(value) => handleInputChange("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hộp số" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL">Số sàn</SelectItem>
                    <SelectItem value="AUTOMATIC">Số tự động</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Dẫn động *</Label>
                <Select value={formData?.driveTrain} onValueChange={(value) => handleInputChange("driveTrain", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dẫn động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FWD">Dẫn động cầu trước</SelectItem>
                    <SelectItem value="RWD">Dẫn động cầu sau</SelectItem>
                    <SelectItem value="AWD">Dẫn động 4 bánh toàn thời gian</SelectItem>
                    <SelectItem value="FOUR_WD">Dẫn động 4 bánh bán thời gian</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Tình trạng *</Label>
                <Select value={formData?.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Mới</SelectItem>
                    <SelectItem value="LIKE_NEW">Như mới</SelectItem>
                    <SelectItem value="USED">Đã sử dụng</SelectItem>
                    <SelectItem value="FAIR">Bình thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odo">Số km đã đi *</Label>
                <Input
                  id="odo"
                  type="number"
                  placeholder="50000"
                  value={formData?.odo}
                  onChange={(e) => handleInputChange("odo", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc</Label>
                <Input
                  id="color"
                  placeholder="Trắng, Đen, Bạc..."
                  value={formData?.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doorNumber">Số cửa *</Label>
                <Input
                  id="doorNumber"
                  type="number"
                  placeholder="4"
                  value={formData?.doorNumber}
                  onChange={(e) => handleInputChange("doorNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatNumber">Số ghế</Label>
                <Input
                  id="seatNumber"
                  placeholder="4"
                  value={formData?.seatNumber}
                  onChange={(e) => handleInputChange("seatNumber", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Giá bán và địa điểm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá bán hiện tại (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="500000000"
                  value={formData?.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="600000000"
                  value={formData?.originalPrice}
                  onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa điểm *
              </Label>
              <Input
                id="location"
                placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                value={formData?.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Images Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Hình ảnh xe ({imagePreviews?.length}/10)
            </CardTitle>
            <CardDescription>Tải lên tối đa 10 hình ảnh. Hình ảnh đầu tiên sẽ là hình chính.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <Label htmlFor="images" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">Chọn hình ảnh</span>
                  <span className="text-gray-500"> hoặc kéo thả vào đây</span>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imagePreviews?.length >= 10}
                />
                <p className="text-sm text-gray-500">PNG, JPG, GIF tối đa 5MB mỗi file</p>
              </div>
            </div>

            {images?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      imagePreviews?.forEach((url) => {
                        // if (url.startsWith("blob:")) {
                        //   URL.revokeObjectURL(url)
                        // }
                      })
                      setImages([])
                      setImagePreviews([])
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa tất cả
                  </Button>
                </div>

                <p className="text-sm text-gray-600">Ảnh cũ</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images?.map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={`item ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Main image badge */}
                      {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Ảnh chính</Badge>}

                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={() => removeImageOriginal(index, item?.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* File info */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 truncate">
                          {images[index]?.id || `Ảnh hiện tại ${index + 1}`}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-600">Ảnh thêm mới</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews?.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={() => removeImageNew(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* File info */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 truncate">
                          {images[index]?.id || `Ảnh hiện tại ${index + 1}`}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>

                {imagePreviews?.length < 10 && (
                  <div className="text-center">
                    <Label htmlFor="images" className="cursor-pointer">
                      <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Thêm ảnh ({10 - imagePreviews?.length} còn lại)</span>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Lịch sử bảo dưỡng & sửa chữa
            </CardTitle>
            <CardDescription>Thêm thông tin về lịch sử bảo dưỡng, sửa chữa của xe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {historyEvents?.map((event: any, index: number) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700">Sự kiện #{index + 1}</h4>
                  {historyEvents.length >= 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHistoryEvent(event?.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`eventDate-${event?.id}`}>Ngày</Label>
                    <Input
                      id={`eventDate-${event?.id}`}
                      type="date"
                      value={event?.eventDate?.split("T")[0]}
                      onChange={(e) => handleHistoryChange(event?.id, "eventDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`eventDescription-${event?.id}`}>Mô tả</Label>
                    <Input
                      id={`eventDescription-${event?.id}`}
                      type="text"
                      placeholder="Bảo dưỡng, sửa chữa, thay thế phụ tùng..."
                      value={event?.description}
                      onChange={(e) => handleHistoryChange(event?.id, "description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addHistoryEvent}
              className="w-full border-dashed border-2 hover:bg-gray-50 bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sự kiện
            </Button>
          </CardContent>
        </Card>

        {/* Car Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tính năng xe
            </CardTitle>
            <CardDescription>Thêm các tính năng đặc biệt của xe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {carFeatures.map((feature, index) => (
              <div key={feature.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700">Tính năng #{index + 1}</h4>
                  {carFeatures.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCarFeature(feature.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`featureName-${feature.id}`}>Tên tính năng</Label>
                  <Input
                    id={`featureName-${feature.id}`}
                    type="text"
                    placeholder="Ví dụ: Ghế da, Hệ thống âm thanh cao cấp..."
                    value={feature.name}
                    onChange={(e) => handleCarFeatureChange(feature.id, "name", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCarFeature}
              className="w-full border-dashed border-2 hover:bg-gray-50 bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm tính năng
            </Button>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Tùy chọn bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHighLight"
                checked={formData?.highLight}
                onCheckedChange={(checked) => handleInputChange("isHighLight", checked as boolean)}
              />
              <Label
                htmlFor="isHighLight"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Đăng tin nổi bật (phí thêm 50,000 VNĐ)
              </Label>
            </div>
          </CardContent>
        </Card>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verify"
              checked={isVerify}
              onCheckedChange={(checked) => setIsVerify(checked as boolean)}
              required
            />
            <Label
              htmlFor="verify"
              className="text-sm font-medium text-red-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tôi cam kết thông tin trên là chính xác
            </Label>
          </div>
        </CardContent>
        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Cập nhật thông tin xe
          </Button>
        </div>
      </form>
    </div>
  )
}
