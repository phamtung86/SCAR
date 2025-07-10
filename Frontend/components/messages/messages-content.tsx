"use client"

import { Bell, Calendar, Camera, Car, DollarSign, Flag, MapPin, MessageSquare, MoreVertical, Paperclip, Phone, Search, Send, Settings, Shield, Smile, Star, Video, X } from 'lucide-react'
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { ScrollArea } from "@/components/ui/scroll-area"
import CarAPI from "@/lib/api/car"
import chatMessageAPI from '@/lib/api/chat-message'
import { formatMoney } from '@/lib/utils/money-format'
import { formatTime } from '@/lib/utils/time-format'
import { useChat } from "../../hooks/use-chat"
import { CarInfoCard } from "../car-info-card"
import { useWebSocket } from '../contexts/WebsocketContext'
import { AppointmentModal } from "../modals/appointment-modal"
import { LocationModal } from "../modals/location-modal"
import { PriceOfferModal } from "../modals/price-offer-modal"
import { UserProfileModal } from "../modals/user-profile-modal"

export default function FullCarChatApp() {
  const searchParams = useSearchParams()
  const carIdParam = searchParams.get("carId")
  const sellerIdParam = searchParams.get("sellerId")

  const carId = carIdParam ? parseInt(carIdParam) : undefined
  const sellerId = sellerIdParam ? parseInt(sellerIdParam) : undefined
  const { stompClient, isConnected, message } = useWebSocket();

  const route = useRouter();

  const {
    users,
    messages,
    selectedChat,
    currentUserId,
    priceOffers,
    setSelectedChat,
    sendMessage,
    sendPriceOffer,
    markAsRead,
    initializeChatFromCar, // Thêm function này vào hook
    setMessages,
    setUsers,
    fetchUserChatted
  } = useChat(stompClient)

  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [carInfo, setCarInfo] = useState<any>(null)

  const [isEnter, setIsEnter] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null);


  const showNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification("📨 Tin nhắn mới", {
        body: message,
        icon: "/logo.png", // tùy chọn icon
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("📨 Tin nhắn mới", {
            body: message,
          });
        }
      });
    }
  };

  useEffect(() => {
    console.log("isConnected ", isConnected);

    if (!isConnected) return;

    if (!stompClient) return;
    setMessages((prev) => [...prev, message]);

    const isExisting = users.some(
      (u) => u?.sender?.id === message?.sender?.id && u?.car?.id === message?.car?.id
    );
    console.log("Thong bao ", document.hidden || !document.hasFocus());

    // if (document.hidden || !document.hasFocus()) {
    showNotification(`💬 Tin nhắn mới từ ${message?.sender?.fullName}`);
    // }
    if (!isExisting) {
      setUsers((prev) => [...prev, { sender: message.sender, car: message.car }]);
    }
  }, [isConnected, carId, message]);

  const fetchCarInfo = async (carId: number) => {
    try {
      const response = await CarAPI.getCarById(carId);
      if (response.status === 200) {
        setCarInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch car info:", error);
    }
  }

  useEffect(() => {
    if (carId) {
      fetchCarInfo(carId)
    }
  }, [carId])

  useEffect(() => {
    if (carId && sellerId) {
      initializeChatFromCar(carId, sellerId);
    }
  }, [isEnter, carId, sellerId]);

  useEffect(() => {
    fetchUserChatted()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);

    return () => clearTimeout(timeout);
  }, [messages, selectedChat]);

  useEffect(() => {
    if (messageInput) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [messageInput])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(currentUserId, sellerId, messageInput.trim(), carId, "TEXT")
      setMessageInput("")
      setIsEnter((pre) => !pre)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && currentUserId && sellerId) {
      const imageUrl = URL.createObjectURL(file)
      // const message = `[Hình ảnh] ${file.name}`
      sendMessage(currentUserId, sellerId, imageUrl, carId, "IMAGE")
    }
  }

  const handleLocationShare = (address: string, latitude?: number, longitude?: number) => {
    const locationText = `Vị trí: ${address}`
    sendMessage(currentUserId, sellerId, locationText, carId, "LOCATION")
  }

  const handleAppointmentSchedule = (date: string, time: string, note: string) => {
    const appointmentText = `Đặt lịch xem xe: ${date} lúc ${time}${note ? ` - ${note}` : ""}`
    sendMessage(currentUserId, sellerId, appointmentText, carId, "APPOINTMENT")
  }

  const hasUnreadMessages = () => {
    return messages.some(msg => !msg.read && msg.sender.id !== currentUserId);
  };

  const renderMessage = (message: any, index: number) => {
    if (!message?.content?.trim()) return null; // Loại bỏ tin nhắn rỗng

    const isMe = message?.sender?.id === currentUserId;

    return (
      <div key={index} className={`flex items-end gap-2 mb-4 ${isMe ? "justify-end" : "justify-start"} items-center`}>
        {!isMe && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={message?.sender?.profilePicture || "/placeholder.svg"} alt={message?.sender?.id} />
            <AvatarFallback>{message?.sender?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}

        <div className="max-w-[70%]">
          <div className={`rounded-2xl px-4 py-2 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            {message.type === "TEXT" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

            {message.type === "IMAGE" && (
              <div className="cursor-pointer" onClick={() => setSelectedImage(message.content)}>
                <Image
                  src={message.content || "/placeholder.svg"}
                  alt="Shared image"
                  width={300}
                  height={200}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {message.type === "LOCATION" && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Vị trí được chia sẻ</p>
                  <p className="text-xs opacity-80">{message.content}</p>
                </div>
              </div>
            )}

            {message.type === "PRICE_OFFER" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Đề xuất giá</span>
                </div>
                <p className="text-lg font-bold">{message.metadata?.offerPrice}</p>
                <p className="text-sm opacity-80">{message.content.split(" - ")[1]}</p>
              </div>
            )}

            {message.type === "APPOINTMENT" && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Lịch hẹn</p>
                  <p className="text-xs opacity-80">{message.content}</p>
                </div>
              </div>
            )}
          </div>

          <p className={`text-xs mt-1 ${isMe ? "text-right text-muted-foreground" : "text-left text-muted-foreground"}`}>
            {formatTime(message?.createdAt)}
            {isMe && !message.read && <span className="ml-1">●</span>}
          </p>
        </div>

        {isMe && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={message?.sender?.profilePicture || "/placeholder.svg"} alt={message?.sender?.id.toString()} />
            <AvatarFallback>{message?.sender?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };


  return (
    <div className="flex h-screen max-w-7xl mx-auto border rounded-lg overflow-hidden bg-background">
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r bg-muted/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Tin nhắn</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {users.map((user, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors mb-2 ${user?.sender?.id === user?.sender?.id &&
                  user?.car?.id === user?.car?.id
                  ? "bg-muted"
                  : ""
                  }`}
                onClick={() => {
                  // const isSameUser =
                  //   user?.sender?.id === user?.sender?.id &&
                  //   user?.car?.id === user?.car?.id;

                  //   console.log(user);

                  // if (!isSameUser) {
                  setSelectedChat(user);
                  route.push(`/messages?carId=${user.car.id}&sellerId=${user.sender.id}`);
                  // }
                }}

              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.sender?.profilePicture || "/placeholder.svg"} alt={user?.sender?.firstName.charAt(0)} />
                      <AvatarFallback>{user?.sender?.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user?.sender?.status && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{user?.sender?.fullName}</h3>
                        {user?.sender?.verified && <Shield className="w-3 h-3 text-blue-500" />}
                      </div>
                      {/* <span className="text-xs text-muted-foreground">{formatTime(user?.createdAt)}</span> */}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Car className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {user?.car?.carModelsBrandName} {user?.car?.carModelsName} {user?.car?.year}
                      </span>
                      <span className="text-xs font-medium text-primary">{formatMoney(user?.car?.price)}</span>
                      {/* <span className="text-xs font-medium text-primary line-through">{user?.car?.originalPrice}</span> */}
                    </div>
                    {/* <p className="text-sm text-muted-foreground truncate mt-1">{user.lastMessage}</p> */}
                    <div className="flex items-center justify-between mt-2">

                      {
                        user?.sender?.rating > 0 ?
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{user?.sender?.rating > 0 ? Math.round(user?.sender?.rating * 10) / 10 : ""}</span>
                          </div>
                          : ""
                      }
                      {/* {user.unread > 0 && (
                        <Badge variant="destructive" className="text-xs h-5">
                          {user.unread}
                        </Badge>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowUserProfileModal(true)}>
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedChat?.sender?.profilePicture || "/placeholder.svg"} alt={selectedChat?.sender?.firstName} />
                      <AvatarFallback>{selectedChat?.sender?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedChat?.sender?.status && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{selectedChat?.sender?.fullName}</h3>
                      {selectedChat?.sender?.verified && <Shield className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat?.sender?.status ? "Đang hoạt động" : "Hoạt động 1 giờ trước"}
                      {isTyping && " • đang nhập..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Gọi điện">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Video call">
                    <Video className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowUserProfileModal(true)}>Xem thông tin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowCarDetails(true)}>Chi tiết xe</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Flag className="w-4 h-4 mr-2" />
                        Báo cáo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Car Info Card - Hiển thị thông tin xe khi có carId */}
            {carId && (
              <div className="p-4 border-b bg-muted/10">
                <CarInfoCard carInfo={carInfo} onViewDetails={() => setShowCarDetails(true)} />
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3 overflow-x-auto">
                <Button variant="outline" size="sm" onClick={() => setShowLocationModal(true)}>
                  <MapPin className="w-4 h-4 mr-1" />
                  Vị trí
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAppointmentModal(true)}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Đặt lịch
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPriceOfferModal(true)}>
                  <DollarSign className="w-4 h-4 mr-1" />
                  Thương lượng
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Liên hệ
                </Button>
              </div>

              {/* Input Area */}
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => cameraInputRef.current?.click()}>
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                  onClick={async () => {
                    if (hasUnreadMessages()) {
                      try {
                        if (currentUserId === null) {
                          return
                        } else {
                          await chatMessageAPI.changeStatusIsRead(currentUserId, selectedChat?.sender?.id, carInfo?.id);
                        }
                      } catch (err) {
                        console.error("Lỗi khi đánh dấu đã đọc:", err);
                      }
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-muted-foreground">Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PriceOfferModal
        isOpen={showPriceOfferModal}
        onClose={() => setShowPriceOfferModal(false)}
        originalPrice={carInfo?.price || ""}
        onSubmit={sendPriceOffer}
      />

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleAppointmentSchedule}
      />

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSubmit={handleLocationShare}
      />

      <UserProfileModal
        isOpen={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
        user={selectedChat}
      />

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-4xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
