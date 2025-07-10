import axiosClient from "../axios-client";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/brands";

const getBrands = async () => {
  const res = await axiosClient.get(URL);
  return res;
}
const BrandAPI = {
  getBrands 
}
export default BrandAPI;