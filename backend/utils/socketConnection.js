const socketIo = require("socket.io");

module.exports = (httpServer) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: [
        "https://telegram-frontend-phi.vercel.app",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
    maxHttpBufferSize: 1e7,
  });

  return io;
};