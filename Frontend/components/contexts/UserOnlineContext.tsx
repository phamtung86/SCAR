"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";


export type User = {
  id: number
  usename: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: string
  updatedAt: string
  role: string
  status: string
  isVerified: boolean
  bio: string
  location: string
  phone: string
  fullName: string
  rating: number
  rank: string
}

type UserOnlineContextType = {
  usersOnline: User[];
  setUsersOnline: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserOnlineContext = createContext<UserOnlineContextType | undefined>(undefined);

export const UserOnlineProvider = ({ children }: { children: ReactNode }) => {
  const [usersOnline, setUsersOnline] = useState<User[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // connect socket hoặc xử lý logic chỉ chạy client
    }
  }, [])
  return (
    <UserOnlineContext.Provider value={{ usersOnline, setUsersOnline }}>
      {children}
    </UserOnlineContext.Provider>
  );
};

export const useUserOnline = () => {
  const context = useContext(UserOnlineContext);
  if (!context) throw new Error("useUserOnline must be used within a UserOnlineProvider");
  return context;
};