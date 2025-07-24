"use client"

import type React from "react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import CarAPI from "@/lib/api/car"
import ImageProcess from "@/lib/api/image-process"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { formatMoney } from "@/lib/utils/money-format"
import { formatDateToDateTime, formatTime } from "@/lib/utils/time-format"
import dayjs from "dayjs"
import {
  Bell,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCheck,
  CornerUpRight,
  DollarSign,
  Edit,
  Flag,
  MapPin,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Reply,
  Search,
  Send,
  Settings,
  Shield,
  Smile,
  Star,
  Trash2,
  Video,
  X,
} from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useChat } from "../../hooks/use-chat"
import { useWebSocket } from "../contexts/WebsocketContext"
import { AppointmentModal } from "../modals/appointment-modal"
import { LocationModal } from "../modals/location-modal"
import { PriceOfferModal } from "../modals/price-offer-modal"
import { UserProfileModal } from "../modals/user-profile-modal"
import MessageForward from "./message-forward"

type UserDTO = {
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
  verified: boolean
  bio: string
  location: string
  phone: string
  fullName: string
  rating: number
  rank: string
}

type ChatMessage = {
  id?: number
  sender: UserDTO
  recipient?: UserDTO
  content: string
  timestamp: string
  carId?: number | null
  type: "TEXT" | "IMAGE" | "PRICE_OFFER"
  isRead?: boolean
  isEdited?: boolean
}
export default function FullCarChatApp() {
  const searchParams = useSearchParams()
  const carIdParam = searchParams.get("carId")
  const sellerIdParam = searchParams.get("sellerId")
  const carId = carIdParam ? Number.parseInt(carIdParam) : undefined
  const sellerId = sellerIdParam ? Number.parseInt(sellerIdParam) : undefined
  const user = getCurrentUser()
  const route = useRouter()
  const { stompClient, isConnected, message } = useWebSocket()

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
    initializeChatFromCar,
    setMessages,
    setUsers,
    fetchUserChatted,
    changeStatusIsRead,
    editMessage,
    deleteMessage,
    forwardMessage
  } = useChat(stompClient)

  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPriceOfferModal, setShowPriceOfferModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [carInfo, setCarInfo] = useState<any>(null)
  const [isEnter, setIsEnter] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<any>(null)
  const [editMessageId, setEditMessageId] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [messageToForward, setMessageToForward] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isConnected || !stompClient || !message) return;
    console.log("Tin nhan den ",message);
    if (message?.sender?.id === sellerId && message?.recipient?.id === user?.id && message?.car?.id === carId) {
      setMessages((prev) => [...prev, message]);
    }

    const existingIndex = users.findIndex(
      (u) => u?.sender?.id === message.sender?.id && u?.car?.id === message.car?.id
    );

    if (existingIndex === -1) {
      setUsers((prev) => [
        ...prev,
        { sender: message.sender, car: message.car, isRead: false },
      ]);
    } else {
      setUsers((prev) => {
        const newUsers = [...prev];
        const [existingUser] = newUsers.splice(existingIndex, 1);
        newUsers.unshift({ ...existingUser, isRead: false });
        return newUsers;
      });

    }
  }, [isConnected, stompClient, carId, message]);


  const fetchCarInfo = async (carId: number) => {
    try {
      const response = await CarAPI.getCarById(carId)
      if (response.status === 200) {
        setCarInfo(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch car info:", error)
    }
  }

  useEffect(() => {
    if (carId) {
      fetchCarInfo(carId)
    }
  }, [carId])

  const subcribeIsRead = () => {
    if (!isConnected || !stompClient) return;

    stompClient.subscribe(`/user/${currentUserId}/queue/seen`, (message) => {
      const readMessages: ChatMessage[] = JSON.parse(message.body);
      console.log("seen ", readMessages);
      
      if (!readMessages || readMessages.length === 0) return;
      setMessages((prev) =>
        prev.map((msg) =>
          readMessages.find((rm) => rm.id === msg.id) ? { ...msg, read: true } : msg
        )
      );
    });
  };


  const subcribeEdit = () => {
    if (!isConnected || !stompClient) return
    stompClient.subscribe(`/user/${currentUserId}/queue/edit`, (message) => {
      const readMessages: ChatMessage = JSON.parse(message.body)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === readMessages.id ? { ...msg, content: readMessages.content, edited: true } : msg)),
      )
    })
  }
  const subcribeDelete = () => {
    if (!isConnected || !stompClient) return
    stompClient.subscribe(`/user/${currentUserId}/queue/delete`, (message) => {
      const readMessages: ChatMessage = JSON.parse(message.body)
      setMessages((prev) => {
        const newArr = [...prev]
        const index = newArr.findIndex((msg) => msg.id === readMessages.id)
        if (index !== -1) newArr.splice(index, 1)
        return newArr
      })
    })
  }

  useEffect(() => {
    subcribeIsRead()
    subcribeEdit()
    subcribeDelete()
  }, [])

  useEffect(() => {
    if (carId && sellerId) {
      initializeChatFromCar(carId, sellerId)
    }
  }, [isEnter, carId, sellerId])

  useEffect(() => {
    fetchUserChatted()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 200)

    return () => clearTimeout(timeout)
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(currentUserId, sellerId, messageInput.trim(), carId, "TEXT", [], replyToMessage?.id)
      setMessageInput("")
      setIsEnter((pre) => !pre)
      setReplyToMessage(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentUserId || !sellerId) return

    const formData = new FormData()
    formData.append("files", file)

    try {
      const response = await ImageProcess.uploadImage(formData)
      if (response.status === 200) {
        const uploadedUrl = response.data
        const type = file.type.startsWith("image/") ? "IMAGE" : "VIDEO"
        sendMessage(currentUserId, sellerId, "", carId, type, uploadedUrl, null)
        setIsEnter((pre) => !pre)
      }
    } catch (error) {
      console.error("Lỗi khi upload file:", error)
    }
  }

  const handleLocationShare = (address: string, latitude?: number, longitude?: number) => {
    const locationText = `Vị trí: ${address}`
    sendMessage(currentUserId, sellerId, locationText, carId, "LOCATION", [], null)
    setIsEnter((pre) => !pre)
  }

  const handleAppointmentSchedule = (date: string, time: string, note: string) => {
    const appointmentText = `Đặt lịch xem xe: ${date} lúc ${time}${note ? ` - ${note}` : ""}`
    sendMessage(currentUserId, sellerId, appointmentText, carId, "APPOINTMENT", [], null)
    setIsEnter((pre) => !pre)
  }

  const hasUnreadMessages = () => {
    return messages.some((msg) => !msg.read && msg.sender.id !== currentUserId)
  }

  const handleNavigateCarDetail = (carId: number) => {
    route.push(`car/${carId}`)
  }

  const handleEditMessage = (msg) => {
    setEditMessageId(msg.id)
    setEditingText(msg.content)
  }

  const handleSubmitEdit = async () => {
    if (editingText.trim()) {
      try {
        editMessage(editMessageId, currentUserId, sellerId, carId, editingText)
        setEditMessageId(null)
        setEditingText("")
        setIsEnter((pre) => !pre)
      } catch (err) {
        console.error("Lỗi khi chỉnh sửa tin nhắn", err)
      }
    }
  }

  const handleForwardMessage = (msg: any) => {
    setMessageToForward(msg)
    setShowForwardModal(true)
  }

  const handleForwardToContacts = async (selectedContacts: number[], message: any, selectedCarInfor: number) => {
    try {
      for (const contactId of selectedContacts) {
        await forwardMessage(currentUserId, contactId, message.content, selectedCarInfor, message.type)
      }
      setIsEnter((pre) => !pre)
    } catch (err) {
      console.error("Lỗi khi chuyển tiếp tin nhắn:", err)
    }
  }

  const handleDeleteMessage = async (msgId) => {
    try {
      deleteMessage(msgId, currentUserId, sellerId, carId)
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
      setIsEnter((pre) => !pre)
    } catch (err) {
      console.error("Lỗi khi xóa tin nhắn:", err)
    }
  }

  const handleReadMessage = (message: any) => {
    const { sender, car } = message;
    setUsers((prev) =>
      prev.map((u) =>
        u?.sender?.id === sender?.id && u?.car?.id === car?.id
          ? { ...u, isRead: true }
          : u
      )
    );
  }

  const scrollToMessage = (messageId: number) => {
    console.log("Scrolling to message:", messageId)

    const messageElement = document.getElementById(`message-${messageId}`)
    const messagesContainer = messagesContainerRef.current

    // Tìm ScrollArea container (parent của messagesContainer)
    const scrollContainer =
      messagesContainer?.closest("[data-radix-scroll-area-viewport]") || messagesContainer?.parentElement?.parentElement

    if (messageElement && scrollContainer) {
      // Tính toán vị trí của message trong scroll container
      const containerRect = scrollContainer.getBoundingClientRect()
      const messageRect = messageElement.getBoundingClientRect()

      // Scroll đến vị trí message trong container
      const scrollTop =
        scrollContainer.scrollTop +
        messageRect.top -
        containerRect.top -
        containerRect.height / 2 +
        messageRect.height / 2

      scrollContainer.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      })

      // Highlight message
      messageElement.classList.add("highlight-message")
      setTimeout(() => {
        messageElement.classList.remove("highlight-message")
      }, 2000)
    } else {
      console.log("Message element or scroll container not found:", {
        messageElement,
        messagesContainer,
        scrollContainer,
      })

      // Fallback: sử dụng scrollIntoView
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
        messageElement.classList.add("highlight-message")
        setTimeout(() => {
          messageElement.classList.remove("highlight-message")
        }, 2000)
      }
    }
  }

  const renderReplyAttachment = (replyTo: ChatMessage) => {
    if (!replyTo) return null

    return (
      <div
        className="mb-2 p-2 border-l-4 border-primary/50 bg-muted/30 rounded-r cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => scrollToMessage(replyTo?.id)}
      >
        <div className="flex items-center gap-1 mb-1">
          <Reply className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">{replyTo?.sender?.fullName}</span>
        </div>

        <div className="text-xs text-white text-muted-foreground line-clamp-2">
          {replyTo?.type === "TEXT" && replyTo?.content}
          {replyTo?.type === "IMAGE" && (
            <div className="flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>Hình ảnh</span>
            </div>
          )}
          {replyTo?.type === "VIDEO" && (
            <div className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              <span>Video</span>
            </div>
          )}
          {replyTo?.type === "LOCATION" && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Vị trí</span>
            </div>
          )}
          {replyTo?.type === "PRICE_OFFER" && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>Đề xuất giá</span>
            </div>
          )}
          {replyTo?.type === "APPOINTMENT" && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Lịch hẹn</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMessage = (message: any, index: number) => {
    if (!message?.content?.trim()) return null
    const isMe = message?.sender?.id === currentUserId
    return (
      <div id={`message-${message?.id}`} key={index} className={`flex items-end gap-2 mb-4 ${isMe ? "justify-end" : "justify-start"} items-center`}>
        {!isMe && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={message?.sender?.profilePicture || "/placeholder.svg"} alt={message?.sender?.id} />
            <AvatarFallback>{message?.sender?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}

        <div className="max-w-[70%] ">
          <div
            className={`rounded-2xl px-4 py-2 text-white`}
            style={{ backgroundColor: isMe ? "#3f6eeeff" : "#8E34EA" }}
          >

            {message?.parentChat && renderReplyAttachment(message.parentChat)}
            {message?.type === "TEXT" && <p className="text-sm whitespace-pre-wrap">{message?.content}</p>}

            {message?.type === "IMAGE" && (
              <div className="cursor-pointer" onClick={() => setSelectedImage(message?.content)}>
                <Image
                  src={message?.content || "/placeholder.svg"}
                  alt="Shared image"
                  width={300}
                  height={200}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {message?.type === "LOCATION" && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Vị trí được chia sẻ</p>
                  <p className="text-xs opacity-80">{message?.content}</p>
                </div>
              </div>
            )}

            {message?.type === "PRICE_OFFER" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Đề xuất giá</span>
                </div>
                <p className="text-lg font-bold">{formatMoney(message?.content.split(":")[1].split(" - ")[0])}</p>
                <p className="text-sm opacity-80">Ghi chú: {message?.content.split(" - ")[1]}</p>
              </div>
            )}

            {message?.type === "VIDEO" && (
              <div className="cursor-pointer">
                <video
                  controls
                  src={message?.content}
                  className="rounded-lg max-w-full h-auto"
                  width={300}
                  height={200}
                />
              </div>
            )}

            {message?.type === "APPOINTMENT" && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Lịch hẹn</p>
                  <p className="text-xs opacity-80">{message?.content}</p>
                </div>
              </div>
            )}
          </div>

          <p
            className={`text-xs mt-1 ${isMe ? "text-right text-muted-foreground" : "text-left text-muted-foreground"}`}
          >
            {dayjs().diff(dayjs(message?.createdAt), "hour") < 24
              ? formatTime(message?.createdAt)
              : formatDateToDateTime(message?.createdAt)}
            {message?.edited && <span className="italic ml-1">(đã chỉnh sửa)</span>}
            {isMe && (
              <span className="inline-flex items-center ml-1">
                {message.read ? (
                  <CheckCheck className="w-4 h-4 text-blue-500" />
                ) : (
                  <Check className="w-4 h-4 text-gray-400" />
                )}
              </span>
            )}
          </p>
        </div>

        {isMe && (

          <Avatar className="w-8 h-8">
            <AvatarImage
              src={message?.sender?.profilePicture || "/placeholder.svg"}
              alt={message?.sender?.id.toString()}
            />
            <AvatarFallback>{message?.sender?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>

        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {message.type === "TEXT" && isMe && (
              <DropdownMenuItem onClick={() => {
                handleEditMessage(message)
                handleReadMessage(message)
              }}>
                <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => {
              handleForwardMessage(message)
              handleReadMessage(message)
            }}>
              <CornerUpRight className="w-4 h-4 mr-2" /> Chuyển tiếp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              handleDeleteMessage(message.id)
              handleReadMessage(message)
            }}>
              <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Xóa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setReplyToMessage(message)
              handleReadMessage(message)
            }}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Trả lời
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

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
            {users.filter((user) => user?.sender?.id !== "undefined" && user?.sender?.id !== undefined).map((user, index) => (

              <div
                key={index}
                className={`${user.isRead ? "bg-gray-100" : "bg-blue-300"
                  } p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors mb-2`}
                onClick={() => {
                  setSelectedChat(user);
                  route.push(`/messages?carId=${user.car.id}&sellerId=${user.sender.id}`);
                }}
              >

                <div className="flex items-start gap-3">
                  <div className="relative">

                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={user?.sender?.profilePicture || "/placeholder.svg"}
                        alt={user?.sender?.firstName.charAt(0)}
                      />
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
                      <span className="text-xs text-muted-foreground">{formatTime(user?.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Car className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {user?.car?.carModelsBrandName} {user?.car?.carModelsName} {user?.car?.year}
                      </span>
                      <span className="text-xs font-medium text-primary">{formatMoney(user?.car?.price)}</span>
                      <Avatar
                        className="w-14 h-14 rounded-[10px] object-cover"
                        onClick={() => setSelectedImage(user?.car?.carImages?.[0]?.imageUrl)}
                      >
                        <AvatarImage
                          src={user?.car?.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                          alt={user?.car?.carImages?.[0]?.carTitle}
                          className="!rounded-[10px] object-cover"
                        />
                        <AvatarFallback>{user?.car?.carImages?.[0]?.imageUrl}</AvatarFallback>
                      </Avatar>
                    </div>
                    {/* <p className="text-sm text-muted-foreground truncate mt-1">{user.lastMessage}</p> */}
                    <div className="flex items-center justify-between mt-2">
                      {user?.sender?.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">
                            {user?.sender?.rating > 0 ? Math.round(user?.sender?.rating * 10) / 10 : ""}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
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
                      <AvatarImage
                        src={selectedChat?.sender?.profilePicture || "/placeholder.svg"}
                        alt={selectedChat?.sender?.firstName}
                      />
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
                      <DropdownMenuItem onClick={() => handleNavigateCarDetail(carId)}>Chi tiết xe</DropdownMenuItem>
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
            {/* {carId && (
              <div className="p-4 border-b bg-muted/10">
                <CarInfoCard carInfo={carInfo} onViewDetails={() => handleNavigateCarDetail(carId)} />
              </div>
            )} */}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            {replyToMessage && (
              <div className="mb-2 p-2 border-l-4 border-primary bg-muted rounded text-sm flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-medium text-primary">Trả lời: {replyToMessage.sender.fullName}</span>
                  <span className="line-clamp-1">{replyToMessage.content || "[media]"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setReplyToMessage(null)} className="ml-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3 overflow-x-auto">
                <Button variant="outline" size="sm" onClick={() => {
                  setShowLocationModal(true);
                  handleReadMessage(message)
                }}>
                  <MapPin className="w-4 h-4 mr-1" />
                  Vị trí
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setShowAppointmentModal(true)
                  handleReadMessage(message)
                }}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Đặt lịch
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setShowPriceOfferModal(true)
                  handleReadMessage(message)
                }}>
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

                {editMessageId && (
                  <div className="text-sm bg-yellow-100 px-3 py-1 rounded mb-2">
                    Đang chỉnh sửa, "{editingText}"
                    <Button variant="link" size="sm" onClick={() => setEditMessageId(null)}>
                      Hủy
                    </Button>
                  </div>
                )}
                <Textarea
                  placeholder={
                    replyToMessage
                      ? `Trả lời ${replyToMessage.sender.fullName}...`
                      : editMessageId
                        ? "Chỉnh sửa tin nhắn..."
                        : "Nhập tin nhắn..."
                  }
                  value={editMessageId ? editingText : messageInput}
                  onChange={(e) => (editMessageId ? setEditingText(e.target.value) : setMessageInput(e.target.value))}
                  onKeyPress={handleKeyPress}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      editMessageId ? handleSubmitEdit() : handleSendMessage()
                    }
                    // Escape để hủy reply hoặc edit
                    if (e.key === "Escape") {
                      if (editMessageId) {
                        setEditMessageId(null)
                        setEditingText("")
                      }
                      if (replyToMessage) {
                        setReplyToMessage(null)
                      }
                    }
                  }}
                  onClick={async () => {
                    if (hasUnreadMessages()) {
                      try {
                        if (currentUserId === null) {
                          return
                        } else {
                          changeStatusIsRead(currentUserId, selectedChat?.sender?.id, carInfo?.id)
                          handleReadMessage(message)
                        }
                      } catch (err) {
                        console.error("Lỗi khi đánh dấu đã đọc:", err)
                      }
                    }
                  }}
                  className={`${replyToMessage ? "border-primary/50 focus:border-primary" : ""} ${editMessageId ? "border-yellow-400 focus:border-yellow-500" : ""
                    }`}
                  rows={replyToMessage || editMessageId ? 3 : 2}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*,video/*"
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
      <MessageForward
        isOpen={showForwardModal}
        onClose={() => {
          setShowForwardModal(false)
          setMessageToForward(null)
        }}
        messageToForward={messageToForward}
        onForward={handleForwardToContacts}
        users={users}
      />
    </div>
  )
}
