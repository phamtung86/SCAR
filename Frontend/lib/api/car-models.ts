import axiosClient from "../axios-client";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/car-models";

const getCarModelsByBrandIdAnhCarTypeId = (brandId : number, carTypeId : number) => {
    return axiosClient.get(`${URL}/brand/${brandId}/car-type/${carTypeId}`);
}
const CarModelAPI = {
    getCarModelsByBrandIdAnhCarTypeId
}
export default CarModelAPI;