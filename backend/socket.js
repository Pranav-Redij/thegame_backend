const { Server } = require("socket.io");

const onlineUsers = {};
const rooms = {};
const matchmakingQueue = [];

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);
    // =====================
    // MAKE MOVE
    // =====================

    socket.on("make_move", ({ roomId, index, symbol }) => {
      io.to(roomId).emit("move_made", {
        index,
        symbol,
      });
    });
    // =====================
    // USER ONLINE
    // =====================

    socket.on("user_online", ({ userId, username }) => {
      onlineUsers[userId] = {
        socketId: socket.id,
        username,
      };

      socket.userId = userId;

      io.emit("online_users_updated", onlineUsers);

      console.log(username, "is online");
    });

    // =====================
    // PLAY REQUEST
    // =====================

    socket.on("play_request", ({ fromUserId, fromUsername, toUserId }) => {
      const receiver = onlineUsers[toUserId];

      if (!receiver) return;

      io.to(receiver.socketId).emit("play_request_received", {
        fromUserId,
        fromUsername,
      });
    });

    // =====================
    // ACCEPT REQUEST
    // =====================

    socket.on(
      "accept_request",
      ({ requesterId, accepterId, accepterUsername }) => {
        const requester = onlineUsers[requesterId];

        const accepter = onlineUsers[accepterId];

        if (!requester || !accepter) return;

        const roomId = `room_${Date.now()}`;

        rooms[roomId] = {
          playerX: requesterId,
          playerO: accepterId,
        };

        io.to(requester.socketId).emit("room_created", {
          roomId,
          mySymbol: "X",
          opponentUsername: accepterUsername,
        });

        io.to(accepter.socketId).emit("room_created", {
          roomId,
          mySymbol: "O",
          opponentUsername: requester.username,
        });
      }
    );

    // =====================
    // REJECT REQUEST
    // =====================

    socket.on("reject_request", ({ requesterId }) => {
      const requester = onlineUsers[requesterId];

      if (!requester) return;

      io.to(requester.socketId).emit("request_rejected");
    });

    // =====================
    // JOIN ROOM
    // =====================

    socket.on("join_room", ({ roomId }) => {
      socket.join(roomId);

      console.log(socket.id, "joined", roomId);
    });

    // =====================
    // JOIN MATCHMAKING
    // =====================

    socket.on("join_matchmaking", ({ userId, username }) => {
      const alreadyInQueue = matchmakingQueue.find((p) => p.userId === userId);

      if (alreadyInQueue) return;

      matchmakingQueue.push({ userId, username, socketId: socket.id });

      socket.matchmakingUserId = userId;

      console.log(username, "joined matchmaking. Queue size:", matchmakingQueue.length);

      if (matchmakingQueue.length >= 2) {
        const playerX = matchmakingQueue.shift();
        const playerO = matchmakingQueue.shift();

        const roomId = `mm_room_${Date.now()}`;

        rooms[roomId] = {
          playerX: playerX.userId,
          playerO: playerO.userId,
        };

        io.to(playerX.socketId).emit("matchmaking_matched", {
          roomId,
          mySymbol: "X",
          opponentUsername: playerO.username,
        });

        io.to(playerO.socketId).emit("matchmaking_matched", {
          roomId,
          mySymbol: "O",
          opponentUsername: playerX.username,
        });

        console.log("Matched:", playerX.username, "vs", playerO.username);
      }
    });

    // =====================
    // LEAVE MATCHMAKING
    // =====================

    socket.on("leave_matchmaking", ({ userId }) => {
      const idx = matchmakingQueue.findIndex((p) => p.userId === userId);

      if (idx !== -1) {
        matchmakingQueue.splice(idx, 1);

        console.log("Left matchmaking. Queue size:", matchmakingQueue.length);
      }
    });

    // =====================
    // DISCONNECT
    // =====================

    socket.on("disconnect", () => {
      const disconnectedUser = socket.userId;

      if (disconnectedUser) {
        delete onlineUsers[disconnectedUser];

        io.emit("online_users_updated", onlineUsers);
      }

      if (socket.matchmakingUserId) {
        const idx = matchmakingQueue.findIndex(
          (p) => p.userId === socket.matchmakingUserId
        );

        if (idx !== -1) {
          matchmakingQueue.splice(idx, 1);
        }
      }

      console.log("Disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
