"use client"

import { useState } from "react"
import { Search, Send, X, ArrowLeft, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MessageForwardProps {
    isOpen: boolean
    onClose: () => void
    messageToForward: any
    onForward: (selectedContacts: number[], message: any) => void
    users: []
}

export default function MessageForward({ isOpen, onClose, messageToForward, onForward, users }: MessageForwardProps) {
    const [selectedContacts, setSelectedContacts] = useState<number[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isForwarding, setIsForwarding] = useState(false)
    const filteredItems = users.filter((item) => item?.sender?.fullName.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleContactSelect = (contactId: number) => {
        setSelectedContacts((prev) =>
            prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
        )
    }

    const handleForward = async () => {
        if (selectedContacts.length === 0 || !messageToForward) return

        setIsForwarding(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Gọi callback để xử lý chuyển tiếp
        onForward(selectedContacts, messageToForward)

        setIsForwarding(false)
        setSelectedContacts([])
        onClose()
    }

    const getSelectedNames = () => {
        return selectedContacts
            .map((id) => users.find((item) => item?.sender?.id === id))
            .filter(Boolean)
            .map((user) => user.sender.fullName);
    }


    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="max-w-md w-full mx-4">
                <Card className="h-[700px] flex flex-col">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle className="text-lg">Chuyển tiếp tin nhắn</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-4 px-4 pb-4">
                        {/* Tin nhắn được chọn */}
                        {messageToForward && (
                            <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-blue-500">
                                <div className="text-xs text-gray-500 mb-1">Tin nhắn được chuyển tiếp:</div>
                                <div className="text-sm text-gray-800">{messageToForward.content}</div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {messageToForward.sender?.fullName} • {messageToForward.time}
                                </div>
                            </div>
                        )}

                        {/* Thanh tìm kiếm */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm liên hệ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Hiển thị người được chọn */}
                        {selectedContacts.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {getSelectedNames().map((name, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {name}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            onClick={() => {
                                                const contact = users.find((item) => item.sender.fullName === name)
                                                if (contact) handleContactSelect(contact.sender.id)
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Danh sách liên hệ */}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {users?.map((item, index) => {
                                const isSelected = selectedContacts.includes(item?.sender?.id)
                                return (
                                    <div
                                        key={index}
                                        className={`flex item?s-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleContactSelect(item?.sender?.id)}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded border-2 flex item?.sender?s-center justify-center ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                                                }`}
                                        >
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>

                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={item?.sender?.profilePicture || "/placeholder.svg"} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                    {item?.sender?.fullName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* {!isGroup && "isOnline" in item?.sender? && item?.sender?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )} */}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{item?.sender?.fullName}</div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {/* {isGroup ? `${item?.sender?.members} thành viên` : item?.sender?.lastSeen} */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {filteredItems.length === 0 && searchQuery && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-sm">Không tìm thấy kết quả</div>
                                    <div className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</div>
                                </div>
                            )}
                        </div>

                        {/* Nút chuyển tiếp */}
                        <Button
                            onClick={handleForward}
                            disabled={selectedContacts.length === 0 || isForwarding}
                            className="w-full"
                            size="lg"
                        >
                            {isForwarding ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    Đang chuyển tiếp...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Chuyển tiếp ({selectedContacts.length})
                                </div>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
