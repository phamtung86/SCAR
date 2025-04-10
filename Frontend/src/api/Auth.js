import axiosClient from "../configs/axiosClient"

const URL = "api/v1/auth"

const login = (data) => {
    return axiosClient.post(`${URL}/login`, data)
}

const AuthApi = {login}
export default AuthApi;