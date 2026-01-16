# 🧠 AI-Powered RFP Management System

## 📌 Short Description

This platform is an **AI-powered Request for Proposal (RFP) management system** that automates the complete procurement workflow — from creating RFPs and sending them to vendors via email, to collecting vendor responses, parsing unstructured proposals using AI, and finally recommending the best vendor with clear reasoning.

The system is designed to closely mirror **real-world enterprise procurement workflows**, while running entirely on **free, local infrastructure** with no paid APIs.

---

## 🎯 What This Platform Does

- Allows users to create and manage RFPs
- Sends RFPs to vendors via Gmail
- Automatically fetches vendor replies from email
- Uses AI to parse unstructured proposal emails into structured data
- Evaluates vendor proposals using AI reasoning
- Recommends the best vendor with an overall explanation
- Provides a clean, intuitive UI for decision-making

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **react-toastify**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Mongoose**
- **MongoDB**

### AI & External APIs
- **Ollama** (local LLM runtime)
- **Mistral model**
- **Gmail API (OAuth 2.0)**

⚠️ **No paid APIs are used. Entire system runs locally.**

---

## ⚙️ Environment Variables

### Backend — `backend/.env.example`

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/rfp_ai_system

# Gmail API
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=

# Ollama (Local AI)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Frontend — `frontend/.env.example`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```
## 🔐 Gmail API Setup (Step-by-Step)

### 1️⃣ Create Google Cloud Project
- Visit: https://console.cloud.google.com  
- Create a new project

### 2️⃣ Enable Gmail API
- Go to **APIs & Services → Library**
- Enable **Gmail API**

### 3️⃣ Configure OAuth Consent Screen
- User type: **External**


### 4️⃣ Create OAuth Credentials
- Credential type: **OAuth Client ID**
- Application type: **Desktop**
- Save the **Client ID** and **Client Secret**

### 5️⃣ Generate Gmail Refresh Token (IMPORTANT)

Run the script:

```bash
cd backend
ts-node scripts/generateGmailRefreshToken.ts
```

### Steps:

-Open the printed authorization URL

-Log in and allow Gmail access

-Copy the generated refresh token

-Paste it into GMAIL_REFRESH_TOKEN in .env

## 🤖 Ollama + Mistral Setup (Local AI)

### Install Ollama
Download Ollama from:
```text
https://ollama.com
```
### Pull mistral
```bash
ollama pull mistral
```
### Run ollama 
```bash
ollama serve
```
### Verify Ollama running
```text
Curl http://localhost:11434
```

## Run project locally

### Backend

```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛡️ Edge Case Handling

- Duplicate vendor replies are prevented
- Evaluation is blocked until **at least 2 proposals** are available
- Draft RFPs cannot be evaluated
- All async operations display loading spinners
- Action buttons are disabled during processing
- AI parsing failures are handled gracefully with safe fallbacks

---

## 🤝 Use of ChatGPT

ChatGPT was used for:
- System design brainstorming
- Architecture validation
- Code structuring assistance
- Debugging TypeScript & Mongoose edge cases

All logic and implementation decisions were **fully understood, reviewed, and validated manually**.
