"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, X } from "lucide-react";
import { CarDTO } from "@/types/car";
import CarAPI from "@/lib/api/car";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function FloatingCarChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Xin chào! Tôi là trợ lý tư vấn xe hơi AI. Bạn đang tìm kiếm loại xe nào? Vui lòng cho tôi biết nhu cầu của bạn như: mục đích sử dụng, ngân sách, loại xe, số chỗ ngồi, v.v.",
      role: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [availableCars, setAvailableCars] = useState<CarDTO[]>([]);

  // Fetch available cars when component mounts
  useEffect(() => {
    if (isOpen) {
      const fetchCars = async () => {
        try {
          // For now using the same API, but in the future we could call a different endpoint that includes images
          const response = await CarAPI.getCars();
          if (response.status === 200) {
            setAvailableCars(response.data);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách xe:", error);
        }
      };

      fetchCars();
    }
  }, [isOpen]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the Gemini API route
      const response = await fetch("/api/car-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          availableCars: availableCars.map(car => ({
            id: car.id,
            title: car.title,
            price: car.price,
            year: car.year,
            fuelType: car.fuelType,
            transmission: car.transmission,
            carModelsCarTypeName: car.carModelsCarTypeName,
            carModelsBrandName: car.carModelsBrandName,
            condition: car.condition,
            description: car.description?.substring(0, 200), // Limit description length
            location: car.location
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant's response to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.reply,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Add error message to chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.error || "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, đã xảy ra lỗi khi kết nối đến hệ thống tư vấn. Vui lòng thử lại sau.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: "1",
        content: "Xin chào! Tôi là trợ lý tư vấn xe hơi AI. Bạn đang tìm kiếm loại xe nào? Vui lòng cho tôi biết nhu cầu của bạn như: mục đích sử dụng, ngân sách, loại xe, số chỗ ngồi, v.v.",
        role: "assistant",
        timestamp: new Date(),
      }
    ]);
  };

  // Sample quick questions to help users get started
  const quickQuestions = [
    "Tôi nên mua xe nào dưới 500 triệu?",
    "Xe 7 chỗ tốt nhất hiện nay?",
    "Xe tiết kiệm xăng nhất?",
    "Xe SUV dưới 1 tỷ?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    // Simulate pressing enter to send the message
    setTimeout(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      document.dispatchEvent(event);
    }, 100);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full p-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white z-50 w-14 h-14"
        >
          <Image
            src="/SCAR_Icon.png"
            alt="SCAR Logo"
            width={56}
            height={56}
            className="h-full w-full rounded-full object-cover"
          />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] z-50">
          <Card className="w-full h-full flex flex-col shadow-xl border rounded-lg overflow-hidden">
            <CardHeader className="p-3 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/SCAR_Icon.png"
                    alt="SCAR Logo"
                    width={40}
                    height={40}
                    className="h-5 w-5 rounded-full"
                  />
                  <CardTitle className="text-white">Trợ lý tư vấn xe</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={handleResetConversation}
                  >
                    <X className="h-4 w-4 rotate-45" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-100 mt-1">Hỗ trợ bởi Google Gemini</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 p-4"
                style={{ maxHeight: 'calc(600px - 180px)' }}
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                            }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Image
                              src="/SCAR_Icon.png"
                              alt="SCAR Logo"
                              width={16}
                              height={16}
                              className="h-5 w-5 rounded-full"
                            />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${message.role === "user"
                            ? "bg-blue-500 text-white rounded-tr-none overflow-x-auto"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                            }`}
                        >
                          {message.role === "assistant" && message.content.includes("🔹") && message.content.includes("• Hãng:") ? (
                            // Display as car cards if it contains car information format
                            <div className="space-y-3">
                              {message.content.split('\n\n').filter(item => item.trim() !== '').map((item, idx) => {
                                if (item.includes("🔹")) {
                                  const lines = item.split('\n');
                                  const titleMatch = lines[0]?.match(/🔹 \d+\. (.+)/);
                                  const title = titleMatch ? titleMatch[1] : '';

                                  if (!title) return <p key={idx} className="whitespace-pre-wrap">{item}</p>;

                                  // Extract car details
                                  const details: Record<string, string> = {};
                                  lines.slice(1).forEach(line => {
                                    const match = line.match(/• ([^:]+): (.+)/);
                                    if (match) {
                                      details[match[1].trim()] = match[2].trim();
                                    }
                                  });

                                  return (
                                    <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                                        <h4 className="font-bold text-lg text-gray-800 flex items-center">
                                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                                            {idx + 1}
                                          </span>
                                          {title}
                                        </h4>
                                      </div>
                                      {/* Car image display */}
                                      {details['Ảnh'] && details['Ảnh'] !== 'N/A' ? (
                                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                                          <img
                                            src={details['Ảnh']}
                                            alt={title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.onerror = null; // prevents infinite loop if fallback also fails
                                              target.src = "/placeholder.jpg"; // fallback image
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                                          <div className="text-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm mt-2">Ảnh xe</p>
                                          </div>
                                        </div>
                                      )}
                                      <div className="p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {details['Hãng'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Hãng:</span>
                                              <span className="font-medium">{details['Hãng']}</span>
                                            </div>
                                          )}
                                          {details['Giá'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Giá:</span>
                                              <span className="text-green-600 font-bold">{details['Giá']}</span>
                                            </div>
                                          )}
                                          {details['Năm sản xuất'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Năm:</span>
                                              <span>{details['Năm sản xuất']}</span>
                                            </div>
                                          )}
                                          {details['Nhiên liệu'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Nhiên liệu:</span>
                                              <span>{details['Nhiên liệu']}</span>
                                            </div>
                                          )}
                                          {details['Hộp số'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Hộp số:</span>
                                              <span>{details['Hộp số']}</span>
                                            </div>
                                          )}
                                          {details['Loại xe'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Loại xe:</span>
                                              <span>{details['Loại xe']}</span>
                                            </div>
                                          )}
                                          {details['Số km đã đi'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Số km:</span>
                                              <span>{details['Số km đã đi']}</span>
                                            </div>
                                          )}
                                          {details['Màu sắc'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Màu:</span>
                                              <span>{details['Màu sắc']}</span>
                                            </div>
                                          )}
                                          {details['Tỉnh/TP'] && (
                                            <div className="flex items-center">
                                              <span className="font-semibold text-gray-600 w-28 flex-shrink-0">Khu vực:</span>
                                              <span>{details['Tỉnh/TP']}</span>
                                            </div>
                                          )}
                                        </div>
                                        {details['Mô tả'] && (
                                          <div className="mt-3 pt-3 border-t border-gray-100">
                                            <span className="font-semibold text-gray-600 block mb-1">Mô tả: </span>
                                            <p className="text-gray-700">{details['Mô tả']}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // For non-car content, render as formatted text
                                  return (
                                    <p
                                      key={idx}
                                      className="whitespace-pre-wrap"
                                      dangerouslySetInnerHTML={{
                                        __html: item
                                          .replace(/•/g, '<span class="font-bold">•</span>')
                                          .replace(/🔹/g, '<span class="font-bold">🔹</span>')
                                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                          .replace(/\n/g, '<br />')
                                      }}
                                    />
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <p
                              className="whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(/•/g, '<span class="font-bold">•</span>')
                                  .replace(/🔹/g, '<span class="font-bold">🔹</span>')
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\n/g, '<br />')
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                          <Image
                            src="/SCAR_Icon.png"
                            alt="SCAR Logo"
                            width={16}
                            height={16}
                            className="h-4 w-4 rounded-full"
                          />
                        </div>
                        <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-2">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {messages.length === 1 && (
                  <div className="mt-6 grid grid-cols-1 gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-left justify-start truncate text-xs py-2"
                      >
                        <Image
                          src="/SCAR_Icon.png"
                          alt="SCAR Logo"
                          width={12}
                          height={12}
                          className="h-3 w-3 mr-2 rounded-full"
                        />
                        {question}
                      </Button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isLoading}
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || inputMessage.trim() === ""}
                    className="h-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}