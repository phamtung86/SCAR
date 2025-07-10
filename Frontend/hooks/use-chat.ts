"use client";

import CarAPI from "@/lib/api/car";
import chatMessageAPI from "@/lib/api/chat-message";
import userAPI from "@/lib/api/user";
import { getCurrentUser } from "@/lib/utils/get-current-user";
import { Client } from "@stomp/stompjs";
import { useCallback, useMemo, useState } from "react";

// ✅ Định nghĩa type
type UserDTO = {
  id: number
  usename: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: string
  updatedAt: string
  role: string
  status: string
  verified: boolean
  bio: string
  location: string
  phone: string
  fullName: string
  rating: number
  rank: string
};

type CarDTO = {
  id: number
  title: string
  description: string
  year: number
  price: number
  originalPrice?: number
  odo: string
  color: string
  location: string
  view: number
  seatNumber: number
  doorNumber: number
  engine: string
  driveTrain: string
  fuelType: string
  transmission: string
  condition: string
  createdAt: string
  updatedAt: string
  carModelsId: number
  carModelsName: string
  carModelsBrandName: string
  carModelsBrandId: number
  carModelsCarTypeId: number
  carModelsCarTypeName: string
  carImages?: [
    {
      id: number
      carId: number
      carTitle: string
      imageUrl: string
      createdAt: string
      updatedAt: string
    }
  ]
  feature?: boolean
  sold?: boolean
  highLight: boolean
  user: {
    id: number
    usename: string
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
    createdAt: string
    updatedAt: string
    role: string
    status: string
    verified: boolean
    bio: string
    location: string
    phone: string
    fullName: string
    rating: number
    rank: string
  }
  carFeatures?: [
    {
      id: number
      name: string
      carId: number
      carTitle: string
    }
  ]
  cacarHistories?: [
    {
      id: number
      eventDate: string
      description: string
      carId: number
      carTitle: string
    }
  ]
};

type ChatUser = {
  sender: UserDTO;
  car: CarDTO;
};

type ChatMessage = {
  id?: number;
  sender: UserDTO;
  recipient?: UserDTO;
  content: string;
  timestamp: string;
  carId?: number | null;
  type: "TEXT" | "IMAGE" | "PRICE_OFFER";
  isRead?: boolean;
};

export function useChat(stompClient: Client | null) {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserId = currentUser?.id || 0;

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [priceOffers, setPriceOffers] = useState<any[]>([]);

  // Hiển thị thông báo khi nhận tin nhắn mới
  function showNotification(message: ChatMessage) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      const title = message.sender.fullName || "Người dùng";
      const body =
        message.type === "TEXT"
          ? message.content
          : message.type === "IMAGE"
            ? "Đã gửi một hình ảnh"
            : message.type === "PRICE_OFFER"
              ? "Gửi một đề xuất giá"
              : "Tin nhắn mới";

      new Notification(title, {
        body,
        icon: message.sender.profilePicture || "/placeholder.svg",
      });
    }
  }

  // Gửi tin nhắn
  const sendMessage = useCallback(
    (senderId: number, recipientId: number, content: string, carId?: number | null, type: ChatMessage["type"] = "TEXT") => {
      if (stompClient && stompClient.connected) {
        const message: Omit<ChatMessage, "id"> = {
          senderId: senderId,
          recipientId: recipientId,
          content,
          timestamp: new Date().toISOString(),
          carId: carId ?? null,
          type,
        };
        // stompClient.publish({
        //   destination: "/app/chat",
        //   body: JSON.stringify(message),
        // });
        console.log(message);
        
      } else {
        console.warn("WebSocket chưa được kết nối.");
      }
    },


    [stompClient]
  );

  // Gửi đề xuất giá
  const sendPriceOffer = useCallback(
    (offerPrice: string, note: string) => {
      if (!selectedChat) return;

      const offerMessage = `Đề xuất giá: ${offerPrice} - ${note}`;
      sendMessage(currentUserId, selectedChat.sender.id, offerMessage, selectedChat.car.id, "PRICE_OFFER");

      const newOffer = {
        id: Date.now(),
        chatId: `${currentUserId}_${selectedChat.sender.id}_${selectedChat.car.id}`,
        offerPrice,
        note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setPriceOffers((prev) => [...prev, newOffer]);
    },
    [selectedChat, sendMessage, currentUserId]
  );

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = useCallback((messageId: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
    );
  }, []);

  const fetchUserChatted = useCallback(async () => {
    try {
      const resUsers = await userAPI.findUserChatted(currentUserId);
      if (resUsers.status === 200) {
        const chatUsers: ChatUser[] = resUsers.data.map((item: any) => ({
          sender: item.sender,
          car: item.car,
        }));
        setUsers(chatUsers);
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin chat ", error);
    }
  }, [currentUserId]); // <- dependencies


  // Khởi tạo chat từ car
  const initializeChatFromCar = useCallback(
    async (carId: number, sellerId: number) => {
      try {
        if (!currentUserId || !carId || !sellerId) {
          console.warn("Thiếu thông tin để khởi tạo chat.");
          return;
        }
        // 1. Lấy danh sách người đã chat


        // 2. Lấy tin nhắn
        const resMessages = await chatMessageAPI.findChatMessages(currentUserId, sellerId, carId);
        if (resMessages.status === 200) {
          setMessages(resMessages.data);
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo chat từ xe:", error);
      }
    },
    [currentUserId]
  );

  return {
    users,
    messages,
    selectedChat,
    currentUserId,
    priceOffers,
    setSelectedChat,
    sendMessage,
    sendPriceOffer,
    markAsRead,
    initializeChatFromCar,
    setMessages,
    setUsers,
    showNotification,
    fetchUserChatted
  };
}
