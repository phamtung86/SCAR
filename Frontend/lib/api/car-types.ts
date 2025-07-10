import axiosClient from "../axios-client";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/car-types";

const getAllCarTypes = () => {
    return axiosClient.get(`${URL}`);
}
const CarTypesAPI = {
    getAllCarTypes
}
export default CarTypesAPI;