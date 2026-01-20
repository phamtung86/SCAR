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
  const res = await axios.post(`${URL}/auth/google`, {
    idToken: idToken,
  });
  return res
}

const forgotPassword = async (email: string) => {
  const res = await axios.post(`${URL}/auth/forgot-password`, { email });
  return res;
}

const validateResetToken = async (token: string) => {
  const res = await axios.get(`${URL}/auth/validate-reset-token`, {
    params: { token }
  });
  return res;
}

const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post(`${URL}/auth/reset-password`, { token, newPassword });
  return res;
}

const AuthAPI = { login, register, loginWithGoogle, forgotPassword, validateResetToken, resetPassword };
export default AuthAPI;
