import React, { createContext, useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { decodeToken } from '../configs/Decode';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [usersOnline, setUsersOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataToken, setDataToken] = useState(null);
  useEffect(() => {
    const dataToken = decodeToken();
    if (dataToken) {
        setDataToken(dataToken);
    }
}, []);
  useEffect(() => {
    // Chỉ khởi tạo kết nối khi dataToken đã có giá trị
    if (!dataToken) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setIsConnected(true);
        // Dùng biến client (đối tượng vừa được tạo) để publish và subscribe
        // client.publish({
        //   destination: "/app/addUser",
        //   body: JSON.stringify({ id: dataToken.userId, username: dataToken.sub }),
        // });
        // client.publish({
        //   destination: "/app/user-status",
        //   body: dataToken.userId,
        // });

        // client.subscribe(`/user/${dataToken.userId}/queue/messages`, (message) => {
        //   setMessages(prevMessages => [
        //     ...prevMessages,
        //     JSON.parse(message.body),
        //   ]);
        // });

        // client.subscribe("/topic/status", (message) => {
        //   const userStatus = JSON.parse(message.body);
        //   setUsersOnline(userStatus);
        // });

        // client.subscribe("/user/public", (message) => {
        //   console.log("Public message:", message.body);
        // });
      },
      onStompError: (frame) => {
        console.error("Error: " + frame.headers["message"]);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [dataToken]);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected, usersOnline, messages, setDataToken }}>
      {children}
    </WebSocketContext.Provider>
  );
};
