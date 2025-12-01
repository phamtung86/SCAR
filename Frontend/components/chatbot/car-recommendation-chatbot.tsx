"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Car, RotateCcw } from "lucide-react";
import { CarDTO } from "@/types/car";
import CarAPI from "@/lib/api/car";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface CarRecommendationChatbotProps {
  className?: string;
}

export function CarRecommendationChatbot({ className }: CarRecommendationChatbotProps) {
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
    const fetchCars = async () => {
      try {
        const response = await CarAPI.getCars();
        if (response.status === 200) {
          setAvailableCars(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xe:", error);
      }
    };

    fetchCars();
  }, []);

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
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Trợ lý tư vấn xe hơi AI
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetConversation}
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Hỗ trợ bởi Google Gemini</p>
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
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                    <Bot className="h-4 w-4" />
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
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left justify-start truncate"
                >
                  <Car className="h-3 w-3 mr-2" />
                  {question}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn về xe hơi..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || inputMessage.trim() === ""}
              className="h-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Trợ lý tư vấn xe hơi dựa trên công nghệ Google Gemini AI
          </p>
        </div>
      </CardContent>
    </Card>
  );
}