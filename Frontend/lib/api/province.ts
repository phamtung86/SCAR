import axios from "axios"

const getListProvinces = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/v2/?depth=2")
    return res;
}

const ProvinceAPI = {
    getListProvinces
}

export default ProvinceAPI;