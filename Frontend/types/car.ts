import { UserDTO } from "./user"

export type CarDTO = {
  id: number
  title: string
  price: number
  originalPrice?: number
  color: string
  location: string
  year: number
  odo: string
  fuelType: string
  transmission: string
  carModelsCarTypeId: number
  carModelsCarTypeName: string
  carModelsId: number
  carModelsName: string
  deleted: boolean
  view: number
  createdAt: string
  status: string
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  carImages?: [
    CarImages
  ]
  carModelsBrandName?: string
  carModelsBrandId?: number
  featured?: boolean
  discount?: number
  condition: string
  description: string
  highLight: boolean
  display: boolean
  sold: boolean
  user: UserDTO
  carFeatures?: [
    CarFeatures
  ]
  carHistories?: [
    CarHistories
  ]
  [key: string]: any
}

export type CarImages = {
  id: number
  carId: number
  carTitle: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export type CarFeatures = {
  id: number
  name: string
  carId: number
  carTitle: string
}

export type CarHistories = {
  id: number
  eventDate: string
  description: string
  carId: number
  carTitle: string
}