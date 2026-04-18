// const NamespaceModel = require("./../models/Chat");
// const UserModel = require("./../models/User");
// const path = require("path");
// const fs = require("fs");

// exports.initConnection = (io) => {
//   io.on("connection", async (socket) => {
//     const namespaces = await NamespaceModel.find({}).sort({ _id: -1 });
//     socket.emit("namespaces", namespaces);
//   });
// };

// exports.getNamespacesRooms = async (io) => {
//   const namespaces = await NamespaceModel.find({}).lean();

//   namespaces.forEach((namespace) => {
//     io.of(namespace.href).on("connection", async (socket) => {
//       let mainNamespace = await NamespaceModel.findOne({
//         _id: namespace._id,
//       });

//       getMessage(io, socket);
//       getLocation(io, socket);
//       getMedia(io, socket);

//       socket.emit("namespaceRooms", mainNamespace.rooms);

//       socket.on("joining", async (newRoom) => {
//         const lastRoom = Array.from(socket.rooms)[1];

//         mainNamespace = await NamespaceModel.findOne({
//           _id: namespace._id,
//         });

//         if (lastRoom) {
//           socket.leave(lastRoom);
//           await getRoomOnlineUsers(io, mainNamespace.href, lastRoom);
//         }

//         socket.join(newRoom);
//         await getRoomOnlineUsers(io, mainNamespace.href, newRoom);

//         const roomInfo = mainNamespace.rooms.find(
//           (room) => room.title === newRoom
//         );
//         socket.emit("roomInfo", roomInfo);

//         socket.on("disconnect", async () => {
//           await getRoomOnlineUsers(io, mainNamespace.href, newRoom);
//         });
//       });
//     });
//   });
// };

// // const getMessage = async (io, socket) => {
// //   socket.on("newMsg", async (data) => {
// //     const { message, roomName, sender } = data;

// //     const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });

// //     await NamespaceModel.updateOne(
// //       { _id: namespace._id, "rooms.title": roomName },
// //       {
// //         $push: {
// //           "rooms.$.messages": {
// //             sender,
// //             message,
// //           },
// //         },
// //       }
// //     );

// //     io.of(namespace.href).in(roomName).emit("confirmMsg", data);
// //   });

// //   detectIsTyping(io, socket);
// // };

// const getMessage = async (io, socket) => {
//   socket.on("newMsg", async (data) => {
//     try {
//       const { message, roomName, sender } = data;

//       // چک کردن اینکه اطلاعات کامل ارسال شده
//       if (!roomName || !message || !sender) {
//         console.error("❌ Invalid message data:", data);
//         return;
//       }

//       // پیدا کردن namespace
//       const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });

//       // اگر namespace پیدا نشد، از ادامه جلوگیری کن
//       if (!namespace) {
//         console.error("❌ Namespace not found for room:", roomName);
//         return;
//       }

//       // آپدیت دیتا درون اتاق
//       await NamespaceModel.updateOne(
//         { _id: namespace._id, "rooms.title": roomName },
//         {
//           $push: {
//             "rooms.$.messages": {
//               sender,
//               message,
//               time: new Date(),
//             },
//           },
//         }
//       );

//       // ارسال پیام به کاربران در همان namespace و room
//       io.of(namespace.href).to(roomName).emit("confirmMsg", data);
//     } catch (err) {
//       console.error("🔥 Error in newMsg handler:", err);
//     }
//   });

//   detectIsTyping(io, socket);
// };


// const detectIsTyping = async (io, socket) => {
  
//   socket.on("isTyping", async (data) => {
//     const { userID, roomName, isTyping } = data;
//     console.log('isTyping==>' , data);
    
//     const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
//     const user = await UserModel.findOne({ _id: userID });
//     console.log(namespace);

//     io.of(namespace.href)
//       .in(roomName)
//       .emit("isTyping", { isTyping, username: user.username });

//     if (!isTyping) {
//       await getRoomOnlineUsers(io, namespace.href, roomName);
//     }
//   });
// };


// const getRoomOnlineUsers = async (io, href, roomName) => {
//   const onlineUsers = await io.of(href).in(roomName).allSockets();
//   console.log(onlineUsers);
//   io.of(href)
//     .in(roomName)
//     .emit("onlineUsersCount", Array.from(onlineUsers).length);
// };

// const getLocation = (io, socket) => {
//   socket.on("newLocation", async (data) => {
//     const { roomName, sender, location } = data;

//     const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });

//     await NamespaceModel.updateOne(
//       {
//         _id: namespace._id,
//         "rooms.title": roomName,
//       },
//       {
//         $push: {
//           "rooms.$.locations": {
//             sender,
//             x: location.x,
//             y: location.y,
//           },
//         },
//       }
//     );

//     io.of(namespace.href).in(roomName).emit("confirmLocation", data);
//   });
// };



// const getMedia = (io, socket) => {
//   socket.on("newMedia", async (data) => {
//     console.log("New Media ->", data);
//     const { filename, file, sender, roomName } = data;
//     const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
//     const ext = path.extname(filename);
//     const mediaPath = `uploads/${String(Date.now() + ext)}`;

//     fs.writeFile(`public/${mediaPath}`, file, async (err) => {
//       if (!err) {
//         await NamespaceModel.updateOne(
//           {
//             _id: namespace._id,
//             "rooms.title": roomName,
//           },
//           {
//             $push: {
//               "rooms.$.medias": {
//                 sender,
//                 path: mediaPath,
//               },
//             },
//           }
//         );

//         io.of(namespace.href).in(roomName).emit("confirmMedia", data);
//       } else {
//         // Error Emit
//       }
//     });
//   });
// };




const NamespaceModel = require("./../models/Chat");
const UserModel = require("./../models/User");
const path = require("path");
const fs = require("fs");

exports.initConnection = (io) => {
  io.on("connection", async (socket) => {
    try {
      const namespaces = await NamespaceModel.find({}).sort({ _id: -1 });
      socket.emit("namespaces", namespaces);
    } catch (err) {
      console.error("❌ Error fetching namespaces:", err);
    }
  });
};

exports.getNamespacesRooms = async (io) => {
  try {
    const namespaces = await NamespaceModel.find({}).lean();

    namespaces.forEach((namespace) => {
      io.of(namespace.href).on("connection", async (socket) => {
        try {
          let mainNamespace = await NamespaceModel.findOne({ _id: namespace._id });
          if (!mainNamespace) return;

          getMessage(io, socket);
          getLocation(io, socket);
          getMedia(io, socket);

          socket.emit("namespaceRooms", mainNamespace.rooms);

          socket.on("joining", async (newRoom) => {
            try {
              const lastRoom = Array.from(socket.rooms)[1];
              mainNamespace = await NamespaceModel.findOne({ _id: namespace._id });
              if (!mainNamespace) return;

              if (lastRoom) {
                socket.leave(lastRoom);
                await getRoomOnlineUsers(io, mainNamespace.href, lastRoom);
              }

              socket.join(newRoom);
              await getRoomOnlineUsers(io, mainNamespace.href, newRoom);

              const roomInfo = mainNamespace.rooms.find(
                (room) => room.title === newRoom
              );

              if (!roomInfo) {
                console.error("❌ Room not found in namespace:", newRoom);
                return;
              }

              socket.emit("roomInfo", roomInfo);

              socket.on("disconnect", async () => {
                await getRoomOnlineUsers(io, mainNamespace.href, newRoom);
              });
            } catch (err) {
              console.error("🔥 Error in joining handler:", err);
            }
          });
        } catch (err) {
          console.error("🔥 Error in namespace connection:", err);
        }
      });
    });
  } catch (err) {
    console.error("❌ Error getting namespaces rooms:", err);
  }
};

const getMessage = (io, socket) => {
  socket.on("newMsg", async (data) => {
    try {
      const { message, roomName, sender } = data;
      if (!message || !roomName || !sender) return console.error("❌ Invalid message data:", data);

      const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
      if (!namespace) return console.error("❌ Namespace not found for room:", roomName);

      await NamespaceModel.updateOne(
        { _id: namespace._id, "rooms.title": roomName },
        { $push: { "rooms.$.messages": { sender, message, time: new Date() } } }
      );

      io.of(namespace.href).to(roomName).emit("confirmMsg", data);
    } catch (err) {
      console.error("🔥 Error in newMsg handler:", err);
    }
  });

  detectIsTyping(io, socket);
};

const detectIsTyping = (io, socket) => {
  socket.on("isTyping", async (data) => {
    try {
      const { userID, roomName, isTyping } = data;
      const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
      if (!namespace) return console.error("❌ Namespace not found for typing:", roomName);

      const user = await UserModel.findOne({ _id: userID });
      if (!user) return console.error("❌ User not found:", userID);

      io.of(namespace.href).in(roomName).emit("isTyping", { isTyping, username: user.username });

      if (!isTyping) {
        await getRoomOnlineUsers(io, namespace.href, roomName);
      }
    } catch (err) {
      console.error("🔥 Error in isTyping handler:", err);
    }
  });
};

const getRoomOnlineUsers = async (io, href, roomName) => {
  try {
    const onlineUsers = await io.of(href).in(roomName).allSockets();
    io.of(href).in(roomName).emit("onlineUsersCount", Array.from(onlineUsers).length);
  } catch (err) {
    console.error("🔥 Error in getRoomOnlineUsers:", err);
  }
};

const getLocation = (io, socket) => {
  socket.on("newLocation", async (data) => {
    try {
      const { roomName, sender, location } = data;
      const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
      if (!namespace) return console.error("❌ Namespace not found for location:", roomName);

      await NamespaceModel.updateOne(
        { _id: namespace._id, "rooms.title": roomName },
        { $push: { "rooms.$.locations": { sender, x: location.x, y: location.y } } }
      );

      io.of(namespace.href).in(roomName).emit("confirmLocation", data);
    } catch (err) {
      console.error("🔥 Error in newLocation handler:", err);
    }
  });
};

const getMedia = (io, socket) => {
  socket.on("newMedia", async (data) => {
    try {
      const { filename, file, sender, roomName } = data;
      const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
      if (!namespace) return console.error("❌ Namespace not found for media:", roomName);

      const ext = path.extname(filename);
      const mediaPath = `uploads/${Date.now() + ext}`;

      fs.writeFile(`public/${mediaPath}`, file, async (err) => {
        if (err) return console.error("❌ Error writing media file:", err);

        await NamespaceModel.updateOne(
          { _id: namespace._id, "rooms.title": roomName },
          { $push: { "rooms.$.medias": { sender, path: mediaPath } } }
        );

        io.of(namespace.href).in(roomName).emit("confirmMedia", data);
      });
    } catch (err) {
      console.error("🔥 Error in newMedia handler:", err);
    }
  });
};
