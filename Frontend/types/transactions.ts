import { CarDTO } from "./car"
import { UserDTO } from "./user"

export type TransactionDTO = {
    id: number
    car: CarDTO
    seller : UserDTO
    buyer : UserDTO
    priceAgreed : number
    buyerCode : string
    buyerName : string
    buyPhone : string
    buyerAddress : string
    paymentMethod : string
    contractDate : string
    contractNumber : string
    createAt : string
    status : string
    updatedAt : string
}

export type TransactionsCRUDForm = {
    carId : number 
    sellerId : number
    buyerId ?: number
    priceAgreed : number
    buyerCode : string
    buyerName : string
    buyerPhone : string
    buyerAddress : string
    paymentMethod : string
    notes: string
    contractNumber : number
    contractDate : string
}