# 🚗 SCAR - Social Car Marketplace Platform

## Tài Liệu Thiết Kế Dự Án

---

## 📋 Tổng Quan Dự Án

**SCAR** là một nền tảng mua bán xe ô tô kết hợp với mạng xã hội, cho phép người dùng:
- Đăng tin bán xe
- Tìm kiếm và mua xe
- Tương tác xã hội (đăng bài, bình luận, thích)
- Chat trực tiếp với người bán
- Thanh toán trực tuyến qua VNPay

---

## 🏗️ Kiến Trúc Hệ Thống

### Công Nghệ Sử Dụng

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Shadcn/UI |
| **Backend** | Spring Boot 3.x, Java 17+ |
| **Database** | MySQL |
| **Cache** | Redis |
| **Message Queue** | RabbitMQ |
| **File Storage** | Cloudinary |
| **Payment Gateway** | VNPay |
| **WebSocket** | STOMP over WebSocket |
| **Authentication** | JWT + OAuth2 (Google, Facebook) |

### Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Next.js + TypeScript)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Auth   │ │   Car   │ │  Post   │ │  Chat   │ │ Payment │   │
│  │  Pages  │ │  Pages  │ │  Pages  │ │  Pages  │ │  Pages  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    (Spring Boot Monolith)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Controllers                           │    │
│  │  Auth │ Car │ Post │ Comment │ Chat │ Payment │ User    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Services                             │    │
│  │  UserService │ CarService │ PaymentService │ ChatService│    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Repositories                          │    │
│  │              (JPA/Hibernate + MySQL)                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────────┐
    │ MySQL  │    │ Redis  │    │RabbitMQ│    │ Cloudinary │
    │   DB   │    │ Cache  │    │ Queue  │    │   Storage  │
    └────────┘    └────────┘    └────────┘    └────────────┘
```

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │──────<│    Cars     │>──────│  CarImages  │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ username    │       │ title       │       │ car_id (FK) │
│ email       │       │ description │       │ image_url   │
│ password    │       │ price       │       └─────────────┘
│ firstName   │       │ year        │
│ lastName    │       │ odo         │       ┌─────────────┐
│ phone       │       │ color       │>──────│ CarFeatures │
│ role        │       │ location    │       │─────────────│
│ rank        │       │ fuel_type   │       │ id (PK)     │
│ status      │       │ transmission│       │ name        │
│ provider    │       │ condition   │       │ car_id (FK) │
│ verified    │       │ status      │       └─────────────┘
└─────────────┘       │ user_id(FK) │
       │              │ car_model_id│       ┌─────────────┐
       │              └─────────────┘>──────│  CarHistory │
       │                    │               │─────────────│
       │                    │               │ id (PK)     │
       ▼                    ▼               │ event_date  │
┌─────────────┐       ┌─────────────┐       │ description │
│    Posts    │       │  CarModels  │       │ car_id (FK) │
│─────────────│       │─────────────│       └─────────────┘
│ id (PK)     │       │ id (PK)     │
│ content     │       │ name        │
│ caption     │       │ brand_id(FK)│
│ user_id(FK) │       │ car_type_id │
│ visibility  │       └─────────────┘
│ created_date│              │
└─────────────┘              ▼
       │              ┌─────────────┐
       │              │   Brands    │
       ▼              │─────────────│
┌─────────────┐       │ id (PK)     │
│  Comments   │       │ name        │
│─────────────│       │ image       │
│ id (PK)     │       └─────────────┘
│ content     │
│ post_id(FK) │
│ user_id(FK) │
└─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Payment   │       │Transactions │       │    Fees     │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ amount      │       │ car_id (FK) │       │ name        │
│ status      │       │ seller_id   │       │ price       │
│ user_id(FK) │       │ buyer_id    │       │ duration    │
│ car_id (FK) │       │ price_agreed│       │ description │
│ payment_type│       │ status      │       │ fee_type    │
│ order_type  │       │ notes       │       │ is_deleted  │
│ fee_id (FK) │       └─────────────┘       └─────────────┘
└─────────────┘

┌─────────────┐       ┌─────────────┐
│ ChatMessage │       │  ChatRoom   │
│─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │
│ sender_id   │       │ sender_id   │
│ receiver_id │       │ receiver_id │
│ content     │       └─────────────┘
│ timestamp   │
│ car_id (FK) │
└─────────────┘
```

### Các Entity Chính

#### 1. User (Người dùng)
```java
Fields:
- id: Integer (PK)
- username: String (unique)
- email: String (unique)
- password: String
- firstName, lastName: String
- phone: String
- profilePicture: String
- role: Enum (USER, ADMIN, DEALER, MODERATOR)
- rank: Enum (NORMAL, PRO, PREMIUM)
- provider: Enum (FORM, GOOGLE, FACEBOOK)
- accountStatus: Enum (ACTIVE, INACTIVE, LOCKED)
- isVerified: Boolean
```

#### 2. Cars (Xe)
```java
Fields:
- id: Integer (PK)
- title, description: String
- price, originalPrice: Double
- year, odo: Integer
- color, location: String
- fuelType: Enum (GASOLINE, DIESEL, ELECTRIC, HYBRID, OTHER)
- transmission: Enum (MANUAL, AUTOMATIC, CVT, OTHER)
- condition: Enum (NEW, LIKE_NEW, USED, FAIR)
- driveTrain: Enum (FWD, RWD, AWD, FOUR_WD, OTHER)
- status: Enum (PENDING, APPROVED, REJECTED)
- isHighLight, isDisplay, isSold: Boolean
- carModels: CarModels (FK)
- user: User (FK)
```

#### 3. Payment (Thanh toán)
```java
Fields:
- id: Integer (PK)
- amount: Long
- paymentType: Enum (VNPAY, MOMO, BANKING)
- status: Enum (PENDING, ERROR, SUCCESS, CANCELED, OVERDUE)
- orderType: Enum (POST_FEE, UPGRADE_ACCOUNT, WALLET_TOPUP, OTHER)
- merchantTxnRef: String (unique)
- user: User (FK)
- car: Cars (FK)
- fee: Fees (FK)
```

#### 4. Transactions (Giao dịch mua bán xe)
```java
Fields:
- id: Integer (PK)
- car: Cars (FK)
- seller, buyer: User (FK)
- priceAgreed: Long
- paymentMethod: Enum (CASH, BANKING, INSTALLMENT, TRADE_IN, OTHER)
- status: Enum (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- buyerName, buyerPhone, buyerAddress: String
- contractDate, contractNumber: Date/String
```

#### 5. Posts (Bài viết)
```java
Fields:
- id: Integer (PK)
- content: Text
- user: User (FK)
- visibility: Enum (PUBLIC, PRIVATE, FRIENDS)
- isEdited, isDeleted: Boolean
- images: List<PostImage>
- comments: List<Comments>
- likes: List<Likes>
```

---

## 🎨 Frontend Architecture

### Cấu Trúc Thư Mục

```
Frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── auth/                     # Authentication pages
│   ├── car/[id]/                 # Car detail page
│   ├── car-chatbot/              # AI Chatbot
│   ├── community/                # Community/Social feed
│   ├── events/                   # Events page
│   ├── management/               # Admin/Seller management
│   │   ├── admin/                # Admin dashboard
│   │   └── seller/               # Seller dashboard
│   ├── marketplace/              # Car marketplace
│   ├── messages/                 # Chat messages
│   ├── notifications/            # User notifications
│   ├── payment/                  # Payment flow
│   ├── profile/                  # User profile
│   ├── reset-password/           # Password reset
│   ├── search/                   # Search results
│   ├── sell-car/                 # Sell car form
│   ├── settings/                 # User settings
│   └── trending/                 # Trending cars
│
├── components/                   # Reusable components
│   ├── auth/                     # Auth components
│   ├── car/                      # Car-related components
│   │   ├── car-card.tsx          # Car card display
│   │   ├── car-detail.tsx        # Car detail view
│   │   ├── car-gallery.tsx       # Image gallery
│   │   ├── car-selling-form.tsx  # Sell car form
│   │   └── car-filter.tsx        # Filter component
│   ├── chatbot/                  # AI Chatbot
│   ├── home/                     # Homepage components
│   ├── layout/                   # Layout components
│   │   ├── main-layout.tsx       # Main layout wrapper
│   │   ├── sidebar.tsx           # Left sidebar
│   │   └── right-sidebar.tsx     # Right sidebar
│   ├── management/               # Dashboard components
│   │   ├── admin-dashboard.tsx   # Admin panel
│   │   └── seller-dashboard.tsx  # Seller panel
│   ├── marketplace/              # Marketplace components
│   ├── messages/                 # Chat components
│   ├── modals/                   # Modal dialogs
│   ├── payment/                  # Payment components
│   ├── profile/                  # Profile components
│   ├── settings/                 # Settings components
│   └── ui/                       # Shadcn UI components
│
├── lib/                          # Utilities & API
│   ├── api/                      # API client functions
│   │   ├── auth.ts               # Auth API
│   │   ├── car.ts                # Car API
│   │   ├── post.ts               # Post API
│   │   ├── payment.ts            # Payment API
│   │   ├── chat-message.ts       # Chat API
│   │   ├── transaction.ts        # Transaction API
│   │   └── user.ts               # User API
│   ├── utils/                    # Utility functions
│   ├── axios-client.ts           # Axios configuration
│   └── token.ts                  # Token management
│
├── types/                        # TypeScript types
│   ├── car.ts                    # Car types
│   ├── user.ts                   # User types
│   ├── payment.ts                # Payment types
│   └── transactions.ts           # Transaction types
│
└── hooks/                        # Custom React hooks
```

### Các Trang Chính

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | `page.tsx` | Trang chủ - News Feed |
| `/auth` | `auth/page.tsx` | Đăng nhập/Đăng ký |
| `/marketplace` | `marketplace/page.tsx` | Danh sách xe bán |
| `/car/[id]` | `car/[id]/page.tsx` | Chi tiết xe |
| `/sell-car` | `sell-car/page.tsx` | Form đăng bán xe |
| `/messages` | `messages/page.tsx` | Tin nhắn chat |
| `/profile` | `profile/page.tsx` | Hồ sơ cá nhân |
| `/settings` | `settings/page.tsx` | Cài đặt tài khoản |
| `/payment` | `payment/page.tsx` | Thanh toán |
| `/management/seller` | `management/seller/page.tsx` | Dashboard người bán |
| `/management/admin` | `management/admin/page.tsx` | Dashboard admin |

---

## ⚙️ Backend Architecture

### Cấu Trúc Package

```
com.t2/
├── ScarApplication.java          # Main application
├── ServletInitializer.java       # Servlet initializer
│
├── config/                       # Configuration classes
│   ├── CloudinaryConfig.java     # Cloudinary setup
│   ├── CorsConfig.java           # CORS configuration
│   ├── RabbitConfig.java         # RabbitMQ setup
│   ├── RedisConfig.java          # Redis cache setup
│   ├── VnPayConfig.java          # VNPay integration
│   ├── WebSecurityConfig.java    # Spring Security
│   └── WebSocketConfig.java      # WebSocket/STOMP
│
├── controller/                   # REST Controllers
│   ├── AuthController.java       # Authentication endpoints
│   ├── CarController.java        # Car CRUD endpoints
│   ├── PostController.java       # Post endpoints
│   ├── ChatMessageController.java# Chat endpoints
│   ├── PaymentController.java    # Payment endpoints
│   ├── UserController.java       # User endpoints
│   └── TransactionsController.java
│
├── service/                      # Business logic
│   ├── UserService.java          # User operations
│   ├── CarService.java           # Car operations
│   ├── PaymentService.java       # Payment processing
│   ├── ChatMessageService.java   # Chat operations
│   ├── PostService.java          # Post operations
│   ├── EmailService.java         # Email sending
│   └── PasswordResetService.java # Password reset
│
├── repository/                   # JPA Repositories
│   ├── IUserRepository.java
│   ├── ICarRepository.java
│   ├── IPaymentRepository.java
│   └── ... (other repositories)
│
├── entity/                       # JPA Entities
│   ├── User.java
│   ├── Cars.java
│   ├── Payment.java
│   ├── Posts.java
│   └── ... (other entities)
│
├── dto/                          # Data Transfer Objects
│   ├── UserDTO.java
│   ├── CarDTO.java
│   └── ... (other DTOs)
│
├── form/                         # Request Forms
│   ├── LoginForm.java
│   ├── RegisterForm.java
│   └── ... (other forms)
│
├── mapper/                       # Entity-DTO Mappers
│
├── jwtutils/                     # JWT utilities
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
│
└── exception/                    # Custom exceptions
```

### API Endpoints Chính

#### Authentication (`/api/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/login` | Đăng nhập |
| POST | `/register` | Đăng ký |
| POST | `/refresh-token` | Làm mới token |
| POST | `/forgot-password` | Quên mật khẩu |
| POST | `/reset-password` | Đặt lại mật khẩu |
| GET | `/me` | Lấy thông tin user hiện tại |

#### Cars (`/api/cars`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy danh sách xe |
| GET | `/{id}` | Chi tiết xe |
| POST | `/` | Đăng xe mới |
| PUT | `/{id}` | Cập nhật xe |
| DELETE | `/{id}` | Xóa xe |
| GET | `/user/{userId}` | Xe của user |
| GET | `/search` | Tìm kiếm xe |

#### Posts (`/api/posts`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy danh sách bài viết |
| POST | `/` | Tạo bài viết |
| POST | `/{id}/like` | Thích bài viết |
| POST | `/{id}/comment` | Bình luận |

#### Payment (`/api/payment`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/create-vnpay-url` | Tạo URL thanh toán |
| GET | `/vnpay-return` | Callback từ VNPay |
| GET | `/history` | Lịch sử thanh toán |

#### Chat (`/api/chat`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/messages/{roomId}` | Lấy tin nhắn |
| POST | `/send` | Gửi tin nhắn |
| GET | `/rooms` | Danh sách phòng chat |

---

## 🔐 Authentication & Authorization

### JWT Flow

```
┌─────────┐     1. Login Request      ┌─────────────┐
│ Client  │ ─────────────────────────>│   Backend   │
└─────────┘                           └─────────────┘
     │                                       │
     │     2. Validate & Generate JWT        │
     │<──────────────────────────────────────│
     │                                       │
     │     3. Store Token (localStorage)     │
     │                                       │
     │     4. API Request + Bearer Token     │
     │──────────────────────────────────────>│
     │                                       │
     │     5. Validate Token & Response      │
     │<──────────────────────────────────────│
```

### User Roles

| Role | Quyền hạn |
|------|-----------|
| **USER** | Đăng tin, mua xe, chat, bình luận |
| **DEALER** | Tất cả quyền USER + Quản lý nhiều xe |
| **MODERATOR** | Duyệt tin, quản lý bài viết |
| **ADMIN** | Toàn quyền quản trị |

### User Ranks (Subscription)

| Rank | Tính năng |
|------|-----------|
| **NORMAL** | Giới hạn đăng tin, không có highlight |
| **PRO** | Nhiều tin hơn, highlight cơ bản |
| **PREMIUM** | Không giới hạn, ưu tiên hiển thị |

---

## 💳 Payment Integration (VNPay)

### Flow thanh toán

```
┌────────┐    ┌─────────┐    ┌────────┐    ┌───────┐
│ Client │    │ Backend │    │ VNPay  │    │  Bank │
└───┬────┘    └────┬────┘    └───┬────┘    └───┬───┘
    │              │             │             │
    │ 1. Chọn gói  │             │             │
    │──────────────>             │             │
    │              │             │             │
    │ 2. Tạo Payment (PENDING)   │             │
    │<─────────────│             │             │
    │              │             │             │
    │ 3. Redirect to VNPay       │             │
    │─────────────────────────────>            │
    │              │             │             │
    │              │    4. User thanh toán     │
    │              │             │<───────────>│
    │              │             │             │
    │ 5. Callback (Return URL)   │             │
    │<─────────────────────────────            │
    │              │             │             │
    │ 6. Verify & Update Status  │             │
    │──────────────>             │             │
    │              │             │             │
    │ 7. Kết quả   │             │             │
    │<─────────────│             │             │
```

### Order Types

| Type | Mô tả |
|------|-------|
| `POST_FEE` | Phí đăng tin (highlight, ưu tiên) |
| `UPGRADE_ACCOUNT` | Nâng cấp rank (PRO, PREMIUM) |
| `WALLET_TOPUP` | Nạp tiền ví |

---

## 💬 Real-time Chat (WebSocket)

### STOMP Endpoints

```
WebSocket URL: ws://localhost:8080/ws

Subscribe:
- /user/{userId}/queue/messages   # Tin nhắn cá nhân
- /topic/public                   # Tin nhắn công khai

Send:
- /app/chat.sendMessage           # Gửi tin nhắn
- /app/chat.addUser               # Join chat
```

---

## 📦 Cache Strategy (Redis)

### Cached Data

| Key Pattern | Mô tả | TTL |
|-------------|-------|-----|
| `cars:list:*` | Danh sách xe | 5 phút |
| `car:{id}` | Chi tiết xe | 10 phút |
| `user:{id}` | Thông tin user | 15 phút |
| `brands:all` | Danh sách hãng xe | 1 giờ |
| `models:brand:{id}` | Models theo brand | 1 giờ |

---

## 🔄 Message Queue (RabbitMQ)

### Queues

| Queue | Mô tả |
|-------|-------|
| `email.notification` | Gửi email thông báo |
| `car.approval` | Duyệt xe |
| `payment.completed` | Xử lý sau thanh toán |

---

## 📱 Features Summary

### Đã Hoàn Thành ✅

1. **Authentication**
   - [x] Đăng nhập/Đăng ký
   - [x] OAuth2 (Google, Facebook)
   - [x] JWT Token
   - [x] Quên mật khẩu
   - [x] Reset mật khẩu

2. **Car Management**
   - [x] CRUD xe
   - [x] Upload hình ảnh (Cloudinary)
   - [x] Tìm kiếm, lọc xe
   - [x] Chi tiết xe
   - [x] Quản lý trạng thái (Pending, Approved, Rejected)

3. **Social Features**
   - [x] Đăng bài viết
   - [x] Like, Comment
   - [x] Chat realtime

4. **Payment**
   - [x] VNPay integration
   - [x] Lịch sử thanh toán
   - [x] Nâng cấp tài khoản

5. **Dashboard**
   - [x] Admin dashboard
   - [x] Seller dashboard
   - [x] Thống kê, biểu đồ

### Đang Phát Triển 🚧

1. **AI Chatbot** - Tư vấn xe
2. **Notification System** - Thông báo đẩy
3. **Report System** - Báo cáo vi phạm
4. **Review System** - Đánh giá người bán

---

## 🚀 Deployment

### Docker Compose

```yaml
services:
  backend:
    build: ./Backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
      - rabbitmq

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: scar
      MYSQL_ROOT_PASSWORD: root

  redis:
    image: redis:7

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

---

## 📝 Ghi Chú Phát Triển

### Convention

1. **Naming**
   - Entity: PascalCase (User, Cars, Payment)
   - DTO: PascalCase + DTO (UserDTO, CarDTO)
   - Service: PascalCase + Service (CarService)
   - Repository: I + PascalCase + Repository (ICarRepository)

2. **API Response Format**
   ```json
   {
     "success": true,
     "message": "Success",
     "data": { ... }
   }
   ```

3. **Error Handling**
   - Sử dụng custom exceptions
   - Global exception handler

### Môi Trường

| Environment | URL |
|-------------|-----|
| Frontend DEV | http://localhost:3000 |
| Backend DEV | http://localhost:8080 |
| Redis | localhost:6379 |
| RabbitMQ | localhost:5672 |

---

*Tài liệu được tạo: 2026-01-20*
*Version: 1.0*
