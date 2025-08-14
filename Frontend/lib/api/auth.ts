import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const login = async (username: string, password: string) => {
  const res = await axios.post(URL + "/auth/login", { username, password });
  return res;
};

const register = async (formData: any) => {
  console.log(formData);
  
  const res = await axios.post(URL + "/auth/register", formData);
  return res;
};

const loginWithGoogle = async (idToken: string) => {
  console.log(idToken);
  
  const res = await axios.post(`${URL}/auth/google`, {
    idToken: idToken,
  });
  return res
}

const AuthAPI = { login, register, loginWithGoogle };
export default AuthAPI;