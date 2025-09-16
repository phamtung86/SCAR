import { FeeCRUDForm } from "@/types/fee";
import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/fees";


const createNewFees = (data: FeeCRUDForm) => {
    const res = axiosClient.post(`${URL}`, data)
    return res
}

const findByCode = async (code: string) => {
    const res = await axiosClient.get(`${URL}/code/${code}`)
    return res
}
const findAllByType = async (type: string) => {
    const res = await axiosClient.get(`${URL}/type/${type}`)
    return res
}

const FeeAPI = {
    createNewFees,
    findByCode,
    findAllByType
}

export default FeeAPI;