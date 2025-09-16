import axiosClient from "../axios-client";
import { getCurrentUser } from "../utils/get-current-user";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/car-feature";
const user = getCurrentUser();


const deleteCarFeatureById = async (id: number) => {
    const res = axiosClient.delete(`${URL}/${id}`)
    return res;
}

const CarFeatureAPI = {
    deleteCarFeatureById
}
export default CarFeatureAPI;