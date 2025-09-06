import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/payment";


const vnpayCreatePayment = async (
    amount: number,
    bankCode: string,
    language: string,
    userId: number,
    postId?: number | null
) => {
    const res = await axiosClient.post(
        `${URL}/vnpay/create?amount=${amount}&bankCode=${bankCode}&language=${language}&userId=${userId}${postId ? `&postId=${postId}` : ''}`
    );
    return res
};

const vnpayGetResult = async () => {
    const res = await axiosClient.get(`${URL}/vnpay/return` + window.location.search);
    return res;
}


const Payment = {
    vnpayCreatePayment,
    vnpayGetResult
}

export default Payment;