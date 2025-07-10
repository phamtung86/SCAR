// socketConfig.ts
import { CompatClient, Stomp } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: CompatClient | null = null

export function connectWebSocket(onConnected?: () => void, onError?: (error: any) => void) {
  const socket = new SockJS("http://localhost:8080/ws") 
  stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    console.log("✅ WebSocket connected")
    onConnected && onConnected()
  }, (error : any) => {
    console.error("❌ WebSocket error:", error)
    onError && onError(error)
  })
}

export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log("🔌 WebSocket disconnected")
    })
  }
}

export function getStompClient(): CompatClient | null {
  return stompClient
}
