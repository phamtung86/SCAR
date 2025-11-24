import { TransactionsCRUDForm } from "@/types/transactions";
import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/transactions";

const createTransaction = async (transactionData: TransactionsCRUDForm) => {
    const res = await axiosClient.post(`${URL}`, transactionData)
    return res;
}

const getAllBySellerId = async (sellerId: number) => {
    const res = await axiosClient.get(`${URL}/${sellerId}`)
    return res;
}

const getAllByBuyerId = async (buyerId: number) => {
    const res = await axiosClient.get(`${URL}/buyer/${buyerId}`)
    return res;
}

const getTransactionById = async (transactionId: number) => {
    const res = await axiosClient.get(`${URL}/detail/${transactionId}`)
    return res;
}

const updateTransactionStatus = async (transactionId: number, status: string) => {
    const res = await axiosClient.put(`${URL}/${transactionId}/status?status=${status}`)
    return res;
}

const updateTransaction = async (transactionId: number, data: any) => {
    const res = await axiosClient.put(`${URL}/${transactionId}`, data)
    return res;
}

const deleteTransaction = async (transactionId: number) => {
    const res = await axiosClient.delete(`${URL}/${transactionId}`)
    return res;
}

const TransactionAPI = {
    createTransaction,
    getAllBySellerId,
    getAllByBuyerId,
    getTransactionById,
    updateTransactionStatus,
    updateTransaction,
    deleteTransaction
}
export default TransactionAPI;
