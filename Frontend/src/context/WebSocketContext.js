import React, { createContext, useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS("http://localhost:8080/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // 🔄 Tự động kết nối lại sau 5 giây nếu mất kết nối
        debug: (msg) => console.log("📝 STOMP Debug:", msg), 

        onConnect: () => {
    
          setIsConnected(true);
        },

        onStompError: (frame) => {
          console.error("🔴 Lỗi STOMP:", frame.headers["message"]);
        },

        onWebSocketClose: (event) => {
          console.warn("⚠️ WebSocket đã đóng! Lý do:", event.reason);
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000); // 🔄 Kết nối lại sau 5 giây
        },
      });

      client.activate();
      stompClientRef.current = client;
    };

    connectWebSocket();

    return () => {
      stompClientRef.current?.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient: stompClientRef.current, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
