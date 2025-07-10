import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/users";

const findUserChatted = async (recipientId: number) => {
  const res = await axiosClient.get(`${URL}/chatted/${recipientId}`);
  return res;
}

const findById = async (id: number)=> {
  const res = await axiosClient.get(`${URL}/${id}`)
  return res;
}

const userAPI = {
  findUserChatted,
  findById
};
export default userAPI;