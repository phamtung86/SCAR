export interface CustomerDTO {
  id: number
  name: string
  phone: string
  email: string
  address: string
  cccd: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCustomerRequest {
  name: string
  phone: string
  email?: string
  address: string
  cccd: string
}

export interface UpdateCustomerRequest {
  name?: string
  phone?: string
  email?: string
  address?: string
  cccd?: string
}

export interface CustomerSearchParams {
  query?: string // Tìm theo tên, SĐT, hoặc CCCD
  page?: number
  size?: number
}
