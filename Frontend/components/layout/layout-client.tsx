"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { UserOnlineProvider } from "@/components/contexts/UserOnlineContext";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <UserOnlineProvider>{children}</UserOnlineProvider>
    </ThemeProvider>
  );
}
