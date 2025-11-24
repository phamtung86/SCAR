import { FeeCRUDForm, FeeDTO } from "@/types/fee";
import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/fees";


const createNewFees = (data: FeeCRUDForm) => {
    const res = axiosClient.post(`${URL}`, data)
    return res;
}

const findByCode = async (code: string) => {
    const res = await axiosClient.get(`${URL}/code/${code}`)
    return res;
}
const findAllByType = async (type: string) => {
    const res = await axiosClient.get(`${URL}/type/${type}`)
    return res;
}

const getAllFees = async () => {
    const res = await axiosClient.get(`${URL}`)
    return res;
}

const updateFee = async (id: number, fee: FeeCRUDForm) => {
    const res = await axiosClient.put(`${URL}/${id}`, fee)
    return res;
}

const getTypesAndTypeNames = async () => {
    const res = await axiosClient.get(`${URL}/name-typename`)
    return res;
}

const getAllCodes = async () => {
    const res = await axiosClient.get(`${URL}/codes`)
    return res;
}

const deleteById = async (id: number) => {
    const res = await axiosClient.delete(`${URL}/${id}`)
    return res;
}


const FeeAPI = {
    createNewFees,
    findByCode,
    findAllByType,
    getAllFees,
    updateFee,
    getTypesAndTypeNames,
    getAllCodes,
    deleteById
}

export default FeeAPI;