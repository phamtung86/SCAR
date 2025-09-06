import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/users";

const findUserChatted = async (recipientId: number) => {
  const res = await axiosClient.get(`${URL}/chatted/${recipientId}`);
  return res;
}

const findById = async (id: number) => {
  const res = await axiosClient.get(`${URL}/${id}`)
  return res;
}

const updateUser = async (form: FormData, id: number) => {
  const res = await axiosClient.put(`${URL}/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res
}


const upgradeRankUser = async (userId: number, rank: string) => {
  const res = await axiosClient.put(`${URL}/${userId}/upgrade-rank`, rank)
  return res;
}

const userAPI = {
  findUserChatted,
  findById,
  updateUser,
  upgradeRankUser
};
export default userAPI;