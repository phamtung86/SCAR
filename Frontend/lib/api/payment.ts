import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/payment";


const vnpayCreatePayment = async (
    amount: number,
    bankCode: string,
    language: string,
    userId: number,
    carId: number | null = null,
    paymentId: number | null = null,
    feeId: number | null = null
) => {
    const res = await axiosClient.post(
        `${URL}/vnpay/create?amount=${amount}
        &bankCode=${bankCode}
        &language=${language}
        &userId=${userId}
        ${carId ? `&carId=${carId}` : ''}
        ${paymentId ? `&paymentId=${paymentId}` : ''}
        ${feeId ? `&fee=${feeId}` : ''}`
    );
    return res;

};

const vnpayGetResult = async () => {
    const res = await axiosClient.get(`${URL}/vnpay/return` + window.location.search);
    return res;
}

const getPaymentByUserId = async (userId: number) => {
    const res = await axiosClient.get(`${URL}/user/${userId}`)
    return res;
}

const updateStatusPaymentById = async (id: number, status: string) => {
    const res = await axiosClient.put(`${URL}/${id}/${status}`)
    return res;
}

const getMonthlyTotalRevenue = async(year : number) => {
    const res = await axiosClient.get(`${URL}/monthly-revenue/${year}`);
    return res;
}

const getRevenueByType = async (type : string) => {
    const res = await axiosClient.get(`${URL}/revenue?type=${type}`);
    return res;
}

const getPaymentsByUserIdAndStatus = async (userId: number, status: string) => {
    const res = await axiosClient.get(`${URL}/user/${userId}/status/${status}`)
    return res;
}

const PaymentAPI = {
    vnpayCreatePayment,
    vnpayGetResult,
    getPaymentByUserId,
    updateStatusPaymentById,
    getMonthlyTotalRevenue,
    getRevenueByType,
    getPaymentsByUserIdAndStatus
}

export default PaymentAPI;