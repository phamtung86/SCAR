import { CarRecommendationChatbot } from "@/components/chatbot/car-recommendation-chatbot";

export default function CarChatbotPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Trợ lý tư vấn xe hơi AI</h1>
        <p className="text-center text-gray-600 mb-8">
          Hỏi bất cứ điều gì về xe hơi và nhận tư vấn chuyên nghiệp từ AI của chúng tôi
        </p>
        
        <div className="flex justify-center">
          <CarRecommendationChatbot className="w-full max-w-2xl" />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Trợ lý tư vấn xe hơi này được hỗ trợ bởi công nghệ Google Gemini AI.</p>
          <p className="mt-2">Bạn có thể hỏi về các loại xe, giá cả, tính năng, và nhiều hơn nữa.</p>
        </div>
      </div>
    </div>
  );
}