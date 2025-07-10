import { CompatClient, Stomp } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/chat-messages";

const findChatMessages = async (senderId: number, recipientId: number, carId: number) => {
  const res = await axiosClient.get(`${URL}/sender/${senderId}/recipient/${recipientId}/car/${carId}`);
  return res;
}

const sendHelloMessage = (senderId: number, recipientId: number, content: string, carId?: number | null, type?: string) => {
  const response = axiosClient.post(`${URL}/chat`, {
    senderId,
    recipientId,
    content,
    timestamp: new Date().toISOString(),
    carId: carId ?? null,
    type: type || "TEXT"
  });
  return response;
}

const changeStatusIsRead = async (senderId: number, recipientId: number, carId: number) => {
  const res = await axiosClient.put(`${URL}/change-status-read`, {
    senderId,
    recipientId,
    carId
  });
  return res;
}
const chatMessageAPI = {
  findChatMessages,
  sendHelloMessage,
  changeStatusIsRead
}
export default chatMessageAPI;