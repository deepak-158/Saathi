# Saathi (साथी) — AI Student Companion

> **A production-ready full-stack AI student companion with true long-term memory, built specifically for Indian college and B.Tech students.**

---

## 🌟 Key Differentiator: Long-Term AI Memory Vault

Standard AI chatbots suffer from session amnesia: as soon as you close the tab or change chats, they forget everything. 

**Saathi solves this with an autonomous Memory Vault:**
- **Silent Background Extraction**: After conversations, important details (e.g. active backlogs, target placement companies, current coding stack, personal exam anxiety) are automatically extracted and categorized into `Academic`, `Career`, `Personal`, and `Preferences`.
- **Intelligent Context Injection**: Active memories are injected directly into LLM prompts without token bloat.
- **100% Student Control**: Students can inspect, edit, delete, or manually add memories at any time.

---

## ⚡ 4 Specialized AI Modes

1. **Dost Mode (Friend & Vent)**: Non-judgmental, warm companion that understands hostel life, burnout, exam stress, and uses relatable analogies.
2. **Placement Coach**: Technical interview practice, DSA roadmap planning, resume bullet reviews, and company-specific round strategies.
3. **Academic Tutor**: Step-by-step breakdown of complex subjects (OS, DBMS, Computer Networks, Discrete Maths) with diagrams and intuitive explanations.
4. **Strict Mentor**: Calls out excuses and procrastination, enforces daily discipline, and breaks goals into concrete accountability milestones.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom glassmorphism design system
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Real-Time Streaming**: Server-Sent Events (SSE) reader
- **Markdown & Code**: `react-markdown` + `react-syntax-highlighter` (with syntax highlighting & one-click copy)
- **Icons & Polish**: Lucide React + `react-hot-toast`

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **AI Inference**: Groq Cloud SDK (`llama-3.3-70b-versatile`)
- **Security & Rate Limiting**: Helmet, CORS, Cookie-parser, Express-rate-limit, Zod schema validation
- **Safety Layer**: Real-time crisis detection with integrated verified Indian emergency helplines (Tele-MANAS `14416`, Vandrevala Foundation `9999 666 555`, AASRA)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas connection string)
- Groq API Key (free from [console.groq.com](https://console.groq.com))

### 2. Backend Setup
```bash
cd saathi/backend
npm install
```

Create `.env` in `saathi/backend`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/saathi
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd saathi/frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing

Run backend tests:
```bash
cd saathi/backend
npm test
```
Runs unit tests for crisis & distress detection, input validation, and helper utilities.

---

## 📦 Production Deployment

### 1. Frontend on Vercel
The frontend is configured for instant deployment on [Vercel](https://vercel.com):
1. Import your GitHub repository (`deepak-158/Saathi`) into Vercel.
2. In the project setup:
   - **Root Directory**: `frontend` (or select `frontend` if importing monorepo)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://your-backend.onrender.com/api` or `http://<EC2_IP>:5000/api`)
4. Click **Deploy**. Vercel SPA routing is already configured in `vercel.json` to handle client-side routing seamlessly.

### 2. Backend Deployment
- **Render / Railway**: Configured via `render.yaml` or Docker/Node service.
- **AWS EC2**: Supported via PM2 process manager and Nginx reverse proxy with SSE streaming.
