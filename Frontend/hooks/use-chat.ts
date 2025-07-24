"use client";

import chatMessageAPI from "@/lib/api/chat-message";
import userAPI from "@/lib/api/user";
import { getCurrentUser } from "@/lib/utils/get-current-user";
import { Client } from "@stomp/stompjs";
import { useCallback, useMemo, useState } from "react";

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
  isRead : boolean
};

type ChatMessage = {
  id?: number;
  sender: UserDTO;
  recipient?: UserDTO;
  content: string;
  timestamp: string;
  carId?: number | null;
  type: "TEXT" | "IMAGE" | "PRICE_OFFER" | "VIDEO" | "APPOINTMENT";
  isRead?: boolean;
  isEdited?: boolean;
  parentChat: ChatMessage
};

export function useChat(stompClient: Client | null) {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserId = currentUser?.id || 0;

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [priceOffers, setPriceOffers] = useState<any[]>([]);

  // Gửi tin nhắn
  const sendMessage = useCallback(
    (
      senderId: number,
      recipientId: number,
      content: string,
      carId?: number | null,
      type: ChatMessage["type"] = "TEXT",
      imageUrls?: string[],
      parentChatId: number | null
    ) => {
      if (stompClient && stompClient.connected) {
        const message: Omit<ChatMessage, "id"> = {
          senderId,
          recipientId,
          content: type === "IMAGE" ? "" : content,
          timestamp: new Date().toISOString(),
          carId: carId ?? null,
          parentChatId : parentChatId ?? null,
          type,
          ...(type === "IMAGE" || type === "VIDEO" && imageUrls && imageUrls.length > 0
            ? { files: imageUrls }
            : {}),
        };
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify(message),
        }); 
      } else {
        console.warn("WebSocket chưa được kết nối.");
      }
    },
    [stompClient]
  );

  const forwardMessage = useCallback(
    (
      senderId: number,
      recipientId: number,
      content: string,
      carId?: number | null,
      type: ChatMessage["type"] = "TEXT",
    ) => {
      if (stompClient && stompClient.connected) {
        const message: Omit<ChatMessage, "id"> = {
          senderId,
          recipientId,
          content: content,
          timestamp: new Date().toISOString(),
          carId: carId ?? null,
          type,
        };
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify(message),
        });
      } else {
        console.warn("WebSocket chưa được kết nối.");
      }
    },
    [stompClient]
  );

  const changeStatusIsRead = useCallback(
    (
      senderId: number,
      recipientId: number,
      carId?: number | null,
    ) => {
      if (stompClient && stompClient.connected) {
        const message: Omit<ChatMessage, "id"> = {
          senderId,
          recipientId,
          carId: carId ?? null,
        };

        stompClient.publish({
          destination: "/app/seen",
          body: JSON.stringify(message),
        });
      } else {
        console.warn("WebSocket chưa được kết nối.");
      }
    },
    [stompClient]
  );

  const editMessage = useCallback(
    (
      messageId?: number,
      senderId: number,
      recipientId: number,
      carId?: number | null,
      msg: string
    ) => {
      if (stompClient && stompClient.connected) {
        const messageEdit = {
          id: messageId,
          senderId,
          recipientId,
          carId: carId ?? null,
          message: msg
        };

        stompClient.publish({
          destination: "/app/edit",
          body: JSON.stringify(messageEdit),
        });
      } else {
        console.warn("WebSocket chưa được kết nối.");
      }
    },
    [stompClient]
  );

  const deleteMessage = useCallback(
    (
      messageId?: number,
      senderId: number,
      recipientId: number,
      carId?: number | null,
    ) => {
      if (stompClient && stompClient.connected) {
        const messageEdit = {
          id: messageId,
          senderId,
          recipientId,
          carId: carId ?? null,
        };

        stompClient.publish({
          destination: "/app/delete",
          body: JSON.stringify(messageEdit),
        });
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
          isRead : item.isRead
        }));
        console.log(chatUsers);
        
        setUsers(chatUsers);
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin chat ", error);
    }
  }, [currentUserId]);


  // Khởi tạo chat từ car
  const initializeChatFromCar = useCallback(
    async (carId: number, sellerId: number) => {
      try {
        if (!currentUserId || !carId || !sellerId) {
          console.warn("Thiếu thông tin để khởi tạo chat.");
          return;
        }
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
    fetchUserChatted,
    changeStatusIsRead,
    editMessage,
    deleteMessage,
    forwardMessage
  };
}
