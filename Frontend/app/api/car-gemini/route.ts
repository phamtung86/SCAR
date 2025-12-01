import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Define the expected request body type
interface ChatRequestBody {
  message: string;
  availableCars?: Array<{
    id: number;
    title: string;
    price: number;
    year: number;
    fuelType: string;
    transmission: string;
    carModelsCarTypeName: string;
    carModelsBrandName?: string;
    condition: string;
    description: string;
    location: string;
    carImages?: Array<{
      id: number;
      carId: number;
      carTitle: string;
      imageUrl: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { message, availableCars }: ChatRequestBody = await request.json();

    // Validate API key exists
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model - try gemini-pro first, which is widely available
    let model;
    try {
      model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Using the most widely available model
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
    } catch (e) {
      // If the model initialization fails, return error
      console.error("Model initialization error:", e);
      return NextResponse.json(
        { error: "Không thể khởi tạo mô hình Gemini. Vui lòng kiểm tra API key và quyền truy cập." },
        { status: 500 }
      );
    }

    // Prepare car data for the prompt
    let carsInfo = "Dưới đây là danh sách xe hiện có trong hệ thống SCAR:\n\n";

    if (availableCars && availableCars.length > 0) {
      // Limit to first 20 cars to avoid too large prompt
      const limitedCars = availableCars.slice(0, 20);

      limitedCars.forEach((car, index) => {
        carsInfo += `🔹 ${index + 1}. ${car.title}\n`;
        carsInfo += `   • Hãng: ${car.carModelsBrandName || 'N/A'}\n`;
        carsInfo += `   • Giá: ${car.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}\n`;
        carsInfo += `   • Năm sản xuất: ${car.year}\n`;
        carsInfo += `   • Nhiên liệu: ${car.fuelType}\n`;
        carsInfo += `   • Hộp số: ${car.transmission}\n`;
        carsInfo += `   • Loại xe: ${car.carModelsCarTypeName}\n`;
        carsInfo += `   • Số km đã đi: ${car.odo || 'N/A'}\n`;
        carsInfo += `   • Màu sắc: ${car.color || 'N/A'}\n`;
        carsInfo += `   • Tỉnh/TP: ${car.location}\n`;
        carsInfo += `   • Ảnh: ${car.carImages?.[0]?.imageUrl || 'N/A'}\n`;
        carsInfo += `   • Mô tả: ${car.description?.substring(0, 150) || 'N/A'}...\n\n`;
      });
    } else {
      carsInfo += "Hiện không có xe nào trong hệ thống.\n\n";
    }

    // Create a more specific prompt for car recommendations
    const prompt = `Bạn là một chuyên gia tư vấn xe hơi rất thông thái và thân thiện.
    Người dùng đang hỏi: "${message}"

    ${carsInfo}

    Dựa trên hệ thống xe hiện có và yêu cầu của người dùng, hãy tư vấn cho người dùng về các loại xe phù hợp.
    Nếu câu hỏi liên quan đến việc tìm xe cụ thể, hãy gợi ý các loại xe dựa trên các tiêu chí như:
    - Ngân sách
    - Mục đích sử dụng (gia đình, off-road, thể thao, tiết kiệm nhiên liệu)
    - Loại nhiên liệu (xăng, dầu, điện, hybrid)
    - Hộp số (số sàn, số tự động)
    - Hãng xe (Toyota, Honda, Ford, v.v.)
    - Năm sản xuất
    - Số chỗ ngồi

    Nếu có xe trong hệ thống phù hợp với yêu cầu của người dùng, hãy ưu tiên gợi ý những xe đó.
    Nếu không, hãy gợi ý các mẫu xe phổ biến từ các hãng tương ứng.

    Cung cấp thông tin chi tiết về các xe được gợi ý bao gồm: giá cả, tính năng nổi bật, ưu nhược điểm,
    và lý do tại sao phù hợp với nhu cầu của người dùng. Trả lời bằng tiếng Việt.`;

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      reply: text,
      success: true
    });
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);

    // Provide more specific error information
    if (error.status === 404) {
      return NextResponse.json(
        {
          error: "Mô hình Gemini không tìm thấy. Vui lòng kiểm tra API key và quyền truy cập.",
          success: false
        },
        { status: 500 }
      );
    } else if (error.status === 400) {
      return NextResponse.json(
        {
          error: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin gửi lên.",
          success: false
        },
        { status: 400 }
      );
    } else if (error.status === 403) {
      return NextResponse.json(
        {
          error: "Không có quyền truy cập Gemini API. Vui lòng kiểm tra API key.",
          success: false
        },
        { status: 403 }
      );
    } else if (error.status === 429) {
      return NextResponse.json(
        {
          error: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
          success: false
        },
        { status: 429 }
      );
    } else {
      return NextResponse.json(
        {
          error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu của bạn",
          success: false
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Car Recommendation Chatbot API - Gemini"
  });
}