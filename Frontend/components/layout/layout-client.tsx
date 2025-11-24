"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { UserOnlineProvider } from "@/components/contexts/UserOnlineContext";
import { Toaster } from "sonner";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <UserOnlineProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </UserOnlineProvider>
    </ThemeProvider>
  );
}
