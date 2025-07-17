"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCurrentUser } from "@/lib/utils/get-current-user";

type WebSocketContextType = {
  stompClient: Client | null;
  isConnected: boolean;
  message: []
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

const WebSocketContext = createContext<WebSocketContextType>({
  stompClient: null,
  isConnected: false,
  message: [],
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string[]>([]); // Lưu tin nhắn nhận được

  const currentUser = getCurrentUser();
  const userId = currentUser?.id;
  const initialized = useRef(false);

  function showNotification(message: ChatMessage) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
      const title = `📨 Tin nhắn mới từ ${message?.sender?.fullName || "Người dùng"}`;
      const body =
        message?.type === "TEXT"
          ? message?.content
          : message?.type === "IMAGE"
            ? "Đã gửi một hình ảnh"
            : message?.type === "PRICE_OFFER"
              ? "Gửi một đề xuất giá"
              : message?.type === "APPOINTMENT"
                ? "Gửi một lịch hẹn xem xe"
              : message?.type === "VIDEO"
                ? "Đã gửi một video"
                : "Tin nhắn mới";

      new Notification(title, {
        body,
        icon: message?.sender?.profilePicture || "/placeholder.svg",
      });
    }
  }
  useEffect(() => {
    if (!userId || initialized.current) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("WebSocket debug:", str),
      reconnectDelay: 500,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        setIsConnected(true);
        console.log("✅ WebSocket connected");

        // Gửi thông báo online
        client.publish({
          destination: "/app/user-status/online",
          body: userId.toString(),
        });

        // Subscribe để nhận tin nhắn
        client.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
          const payload = JSON.parse(message.body);
          setMessage(payload);
          if (document.hidden || !document.hasFocus()) {
            showNotification(payload);
          }
        });
      },

      onDisconnect: () => {
        setIsConnected(false);
        console.log("❌ WebSocket disconnected");
      },

      onStompError: (frame) => {
        console.error("❗ Broker reported error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
    });

    client.activate();
    setStompClient(client);
    initialized.current = true;

    // Khi tab bị tắt hoặc reload
    const handleBeforeUnload = () => {
      if (client && client.connected) {
        client.publish({
          destination: "/app/user-status/offline",
          body: userId.toString(),
        });
        client.deactivate();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (client.connected) {
        client.publish({
          destination: "/app/user-status/offline",
          body: userId.toString(),
        });
        client.deactivate();
      }
    };
  }, [userId]);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected, message }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
