const { initConnection, getNamespacesRooms } = require("./namespaces.socket");

module.exports = async (io) => {
  initConnection(io);
  await getNamespacesRooms(io);
};
