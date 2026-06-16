# 💬 Real-Time Telegram Clone

A modern **real-time chat application** inspired by Telegram, built with a custom backend and WebSocket architecture, supporting messaging, media sharing, themes, and live user interactions.

---

## 📸 Demo Preview

> Add GIF or screenshots of the app here (highly recommended for hiring impact)

### 🌙 Dark Mode
![Dark Mode](https://raw.githubusercontent.com/arefesalehi/telegram-websocket/main/frontend/public/screenshots/dark.png)

### ☀️ Light Mode
![Light Mode](https://raw.githubusercontent.com/arefesalehi/telegram-websocket/main/frontend/public/screenshots/light.png)

---

## ✨ Key Features

### 💬 Real-Time Messaging
- Instant messaging using **WebSocket**
- Bidirectional communication (no refresh needed)
- Message delivery in real-time

### 🖼 Media Support
- Send and receive images
- Preview images before sending
- Optimized media rendering

### 😄 Emoji System
- Built-in emoji picker
- Quick emoji reactions in chat

### ⌨️ Live Typing Indicator
- Shows “User is typing...” in real-time
- Smooth debounce handling for performance

### 🌙 Theme System
- Dark & Light mode support
- Persistent user preference
- Smooth UI transitions

### 👤 User Experience
- Online / offline status
- Chat history persistence
- Responsive design (mobile-first)

---

## 🏗 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js / React |
| Styling | Tailwind CSS |
| Backend | Custom Node.js Backend |
| Realtime | WebSocket (Socket.io or native WS) |
| Database | MongoDB |
| Auth | JWT Authentication |

---

## 📁 Project Structure

```bash id="tgws2"
client/
├── components/
├── pages/
├── hooks/
├── styles/

server/
├── sockets/
├── controllers/
├── models/
├── routes/
└── utils/
