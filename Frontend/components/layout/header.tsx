"use client";

import { getCurrentUser } from "@/lib/utils/get-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  ChevronDown,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserOnline } from "../contexts/UserOnlineContext";
import { useWebSocket } from "../contexts/WebsocketContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setUsersOnline } = useUserOnline();
  const { stompClient } = useWebSocket();
  const user = getCurrentUser();

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/auth");

    if (stompClient?.connected) {
      stompClient.publish({
        destination: "/app/user-status/offline",
        body: user?.id.toString(),
      });
      stompClient.deactivate();
    }
  };

  useEffect(() => {
    if (stompClient?.connected && user) {
      stompClient.subscribe("/topic/status", (message) => {
        const userStatus = JSON.parse(message.body);
        setUsersOnline(userStatus);
      });
    }
  }, [stompClient, user]);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-all"
          >
            <div className="relative w-20 h-20">
              <Image
                src="/SCAR.gif"
                alt="Logo"
                width={300}
                height={300}
                className="w-20 h-20"
              />  
            </div>
            {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scar
            </span> */}
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm xe, bài viết, người dùng..."
                className="pl-10 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                3
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white text-xs font-semibold">
                2
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-4">
              <Plus className="h-4 w-4 mr-2" />
              Đăng tin
            </Button>


            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2">
                  <Avatar className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-blue-500/40">
                    <AvatarImage className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-blue-500/40" src={user?.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-60 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-2"
                align="end"
              >
                <DropdownMenuItem
                  asChild
                  className="px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 cursor-pointer"
                >
                  <Link href="/profile">
                    <User className="h-4 w-4 text-blue-500" />
                    Trang cá nhân
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-purple-500" />
                  Cài đặt
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </header>
  );
}
