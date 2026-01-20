import axiosClient from "../axios-client";
import { getCurrentUser } from "../utils/get-current-user";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/cars";
const user = getCurrentUser();
const getCars = async () => {
  const res = await axiosClient.get(URL);
  return res;
}
const getTransmissions = async () => {
  const res = await axiosClient.get(URL + "/transmissions");
  return res;
}
const getFuelTypes = async () => {
  const res = await axiosClient.get(URL + "/fuel-types");
  return res;
}
const getConditions = async () => {
  const res = await axiosClient.get(URL + "/conditions");
  return res;
}
const getDriveTrains = async () => {
  const res = await axiosClient.get(URL + "/drivetrains");
  return res;
}

const getByUserId = async (userId: number) => {
  const res = await axiosClient.get(URL + "/user/" + userId)
  return res;
}

type CarFilterParams = {
  pageNumber: number;
  size: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: number;
  year?: number;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  search?: string;
};

const getCarsPage = async (params: CarFilterParams) => {
  const res = await axiosClient.get(URL + "/page", {
    params,
  });
  return res;
};

const getCarById = async (id: number) => {
  const res = await axiosClient.get(URL + `/${id}`);
  return res;
}

const changeViewCar = async (id: number) => {
  const res = await axiosClient.put(URL + `/change-view/${id}`);
  return res;
}

const createNewCar = async (form: FormData) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  const res = await axiosClient.post(URL, form, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 60000 // 60 seconds for file upload
  });
  return res;
}

const updateCar = async (form: FormData, carId: number) => {
  const res = await axiosClient.put(`${URL}/${carId}`, form,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 60000 // 60 seconds for file upload
    }
  )
  return res;
}

const deleteCarById = async (id: number) => {
  const res = axiosClient.delete(`${URL}/${id}`)
  return res;
}
const getRelatedCars = async (carId: number, carTypeId: number) => {
  const res = axiosClient.get(`${URL}/${carId}/related/type/${carTypeId}`)
  return res;
}
const getCarsByBrandId = async (brandName: string) => {
  const res = axiosClient.get(`${URL}/brand/${brandName}`)
  return res;
}

const getTopCarsOrderByView = async (limit: number) => {
  const res = axiosClient.get(`${URL}/top/${limit}`)
  return res;
}
const getCarsByStatus = async (status: string) => {
  const res = axiosClient.get(`${URL}/status/${status}`)
  return res;
}

const changeStatusCar = async (carId: number, status: string, rejectReason?: string) => {
  const res = await axiosClient.put(`${URL}/${carId}/change-status`, { status, rejectReason });
  return res;
}

const getCarsWithImages = async () => {
  const res = await axiosClient.get(`${URL}?includeImages=true`);
  return res;
}

const CarAPI = {
  getCars,
  getCarById,
  changeViewCar,
  createNewCar,
  getCarsPage,
  getTransmissions,
  getFuelTypes,
  getConditions,
  getDriveTrains,
  getByUserId,
  updateCar,
  deleteCarById,
  getRelatedCars,
  getCarsByBrandId,
  getTopCarsOrderByView,
  getCarsByStatus,
  changeStatusCar,
  getCarsWithImages
};
export default CarAPI;