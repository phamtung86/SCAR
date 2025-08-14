import { WebSocketProvider } from "@/components/contexts/WebsocketContext";
import { LayoutClient } from "@/components/layout/layout-client";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import "./globals.css";
import ConnectionStatus from "@/components/ui/Connection-status";


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
      <body className={inter.className}>
        <WebSocketProvider>
          <LayoutClient>{children}</LayoutClient>
          <ConnectionStatus />
        </WebSocketProvider>
      </body>
    </html>
  );
}
