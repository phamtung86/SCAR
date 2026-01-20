import { WebSocketProvider } from "@/components/contexts/WebsocketContext";
import { ThemeProvider } from "@/components/contexts/theme-context";
import { LayoutClient } from "@/components/layout/layout-client";
import { Inter } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import ConnectionStatus from "@/components/ui/Connection-status";
import { FloatingCarChatbot } from "@/components/chatbot/floating-car-chatbot";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scar - Mạng xã hội xe hơi",
  description: "Cộng đồng và chợ xe hàng đầu Việt Nam",
  generator: "TungPV",
  icons: {
    icon: "/SCAR_Icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <Script src="https://kit.fontawesome.com/7769952fd3.js" crossorigin="anonymous"></Script>
      <body className={inter.className}>
        <ThemeProvider>
          <WebSocketProvider>
            <LayoutClient>{children}</LayoutClient>
            <ConnectionStatus />
          </WebSocketProvider>
          {/* <Script
            id="kami-chat-widget"
            src="https://kamimind.ai/kami-chat-widget.js"
            strategy="afterInteractive"
            defer
            {...{
              token: "5hXtJT863XEMFyScTWqXFKt8kGCVslzr",
              charset: "utf-8",
              botToken: "0ebbc6ed-9fae-45dd-b656-d316ab13b228",
              bottomOffset: "0px",
              bubbleSize: "50",
              autoChatPopup: "false",
              chatPopupDelay: "5",
              tooltipText: "KamiMind Agent",
              tooltipBgColor: "#222",
              tooltipFontSize: "14px",
              width: "400",
              height: "600",
              opacityBackground: "100",
              isNewStory: "false"
            }}
          ></Script> */}
          {/* Car Recommendation Chatbot */}
          <Suspense fallback={null}>
            <FloatingCarChatbot />
          </Suspense>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
