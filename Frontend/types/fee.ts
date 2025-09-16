import { UserDTO } from "./user"

export type FeeServiceDetailsDTO = {
    id: number,
    name: string,
    feeId: number,
    feeCode: string
}

export type FeeDTO = {
    id: number
    name: string
    icon: string
    code: string
    type: string
    price: number
    sale: number
    expirySale: string
    creator: UserDTO
    createdAt: string
    feeServiceDetails: [FeeServiceDetailsDTO]
}

export type FeeCRUDForm = {
    name: string
    icon: string
    code: string
    type: string
    price: number
    sale: number
    expitySale: string
    creatorId: number
    feeServiceDetailName: [string]
}