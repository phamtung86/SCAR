"use client";

import { useWebSocket } from "../contexts/WebsocketContext";

export default function ConnectionStatus() {
    const { isConnected } = useWebSocket();

    // if (isReconnecting) {
    //     return (
    //         <div className="fixed bottom-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg z-50">
    //             🔄 Đang kết nối lại đến máy chủ<span className="dots"></span>
    //         </div>
    //     );
    // }

    if (!isConnected) {
        return (
            <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                ❌ Mất kết nối WebSocket
            </div>
        );
    }

    return null;
}
