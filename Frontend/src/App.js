import { useContext, useEffect, useState } from "react";
import "./App.css";
import ConnectionStatus from "./components/ConnectionStatus";
import { WebSocketContext, WebSocketProvider } from "./context/WebSocketContext";
import Home from "./pages/Home";

function AppContent() {
  const { isConnected } = useContext(WebSocketContext);
  const colors = ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6"]; // Đỏ, Cam, Xanh lá, Xanh dương, Tím
  const [bgColor, setBgColor] = useState(colors[0]);

  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        setBgColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 1000); // Đổi màu mỗi giây
      return () => clearInterval(interval); // Cleanup khi component unmount
    }
  }, [isConnected]); // Chỉ chạy khi mất kết nối

  return (
    <div className="App">
      <ConnectionStatus isConnected={isConnected} />
      <Home />
    </div>
  );
}

function App() {
  return (
    <WebSocketProvider>
      <AppContent />
    </WebSocketProvider>
  );
}

export default App;
