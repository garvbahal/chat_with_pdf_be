# ⚙️ AskDocs Backend API

> Scalable backend powering AI-based PDF chat — processing, embeddings, and intelligent responses.

🌐 API Base URL: https://api.askdocs.dev

---

## 🚀 Overview

The **AskDocs Backend** handles all core functionalities of the platform — from PDF processing and embedding generation to authentication and AI-powered chat responses.

It is built with a modern TypeScript + Node.js stack and integrates **LangChain + Pinecone** for semantic search over documents.

---

## ✨ Features

- 📤 PDF upload & parsing
- 🧠 AI-powered question answering
- 🔍 Semantic search using vector embeddings
- 🗂️ Document chunking & storage
- 🔐 JWT-based authentication
- 🔑 OTP-based email verification
- 📩 Email service integration (Resend)
- ⚡ Fast and scalable API architecture

---

## 🛠️ Tech Stack

### Core Backend

- Node.js
- Express.js
- TypeScript

### Database & Storage

- MongoDB (Mongoose)
- Pinecone (Vector Database)

### AI & Processing

- LangChain
- OpenAI
- PDF-Parse
- @langchain/textsplitters
- @langchain/pinecone
- @langchain/openai
- @langchain/core
- @langchain/community

### Authentication & Security

- bcrypt
- jsonwebtoken (JWT)

### Validation & Middleware

- Zod
- Multer (file uploads)

---

## 📁 Project Structure

```
src/
│
├── config/              # Environment & DB configs
│
├── controllers/         # Request handlers
│   ├── auth.controller.ts
│   ├── chat.controller.ts
│   └── pdf.controller.ts
│
├── middlewares/         # Custom middlewares
│   └── auth.middleware.ts
│
├── models/              # Mongoose models
│   ├── user.model.ts
│   ├── pdf.model.ts
│   ├── chat.model.ts
│   ├── chat_embedding.ts
│   └── otp.model.ts
│
├── routes/              # API routes
│   ├── auth.route.ts
│   └── user.route.ts
│
├── schemas/             # Zod validation schemas
│   ├── auth.schema.ts
│   └── chat.schema.ts
│
├── services/            # Business logic layer
├── utils/               # Helper functions
├── types/               # TypeScript types
│
├── index.ts             # Entry point
│
uploads/                 # Uploaded PDF files
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
PORT=3000

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API=your_openai_api_key
PINECONE_API=your_pinecone_api_key
RESEND_APIKEY=your_resend_api_key
FRONTEND_URL=your_frontend_url

CLIENT_URL=https://www.askdocs.dev
```

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```
git clone https://github.com/garvbahal/chat_with_pdf_be
cd askdocs-backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run the development server

```
npm run dev
```

### 4. Build for production

```
npm run build
npm start
```

---

## 🔄 How It Works

### 📄 PDF Processing Flow

1. User uploads PDF
2. Multer stores file locally (`/uploads`)
3. PDF is parsed using `pdf-parse`
4. Text is split into chunks using LangChain
5. Embeddings are generated via OpenAI
6. Embeddings are stored in Pinecone

---

### 💬 Chat Flow

1. User sends a query
2. Query is converted into embedding
3. Pinecone retrieves relevant chunks
4. Context is passed to LLM (OpenAI)
5. AI generates contextual response
6. Response is returned to frontend

---

### 🔐 Authentication Flow

1. User signs up/login
2. OTP sent via email (Resend)
3. OTP verified
4. JWT issued for authenticated requests

---

## 📡 API Endpoints (High Level)

### Auth

- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/signup/verify`
- `POST /api/v1/resendOtp`

### PDF

- `POST /api/v1/upload`

### Chat

- `POST /api/v1/ask`
- `POST /api/v1/getMessages/:pdfId`
- `GET /api/v1/getAllChatHistory`

---

## 📦 Key Concepts

- **Vector Embeddings** → Enables semantic search instead of keyword search
- **Chunking** → Breaks large PDFs into manageable pieces
- **RAG (Retrieval-Augmented Generation)** → Combines search + LLM for accurate answers

---

## 📌 Future Improvements

- Streaming responses (real-time AI output)
- Better chunk ranking & retrieval
- Multi-document querying
- Background processing (queues)
- File storage (S3 instead of local uploads)

---

## 🚀 Deployment

The backend is deployed at:

👉 https://api.askdocs.dev

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Garv Bahal**  
Full Stack MERN Developer

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!
