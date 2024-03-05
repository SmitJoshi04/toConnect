// const io = require('./index')
const dbcon = require("./connection");
// const math = require("angular-ts-math");
exports.webSocketConnect = (io) => {
  let connectedUsers = {};
  io.on("connection", async (socket) => {
    // console.log(socket);
    socket.on("userId", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log("connectedUsers:::", connectedUsers);
      console.log("user:::", socket.id);
    });

    socket.on("chat message", async (dataString) => {
      console.log("data:::", dataString);

      let data = dataString;

      console.log(socket.id);
      console.log("data:::",data);
      const receiverUserId = data.receiverId//from data
      //   const  = data;//from body sender id
      //   console.log("message:::",message);
      const receiverSocket = connectedUsers[receiverUserId];
      console.log("receiver:::", receiverSocket);
      if (receiverSocket) {
        console.log("receiverSocket:::",receiverSocket);
        io.to(receiverSocket).emit("chat message", {
          senderUserId: data.senderId,//sender id
          receiverUserId:data.receiverId,
          text: data.text,
          time:data.time,
          chatId:data.chatId
        });
        console.log("A user connected with ID:", socket.id);
      } else {
        // Handle the case where the receiver's socket is not found (e.g., user is not connected)
        console.log(
          "Receiver is not connected or does not exist:",
          receiverUserId
        );
      }

      let result;
      try {
         dbcon.getConnection(async (err, con) => {
          if(err)
          console.log(err);
           const result = await con.query('INSERT INTO text (text,rec_id,sen_id,chat_id ) VALUES (?, ?,?,?)', [data.text,data.receiverId,data.senderId,data.chatId]);
            // console.log(result);
            con.release();
        });
        console.log("hello");
      } catch (e) {
        if (e) {
        } else {
          // nothing to do, just let the client retry
        }
        return;
      }

    });
    socket.on("connect", () => {
      console.log("Reconnected to the server");
    });

    socket.on("disconnect", (userId) => {
      console.log("Disconnected from the server");
      connectedUsers[userId] = socket.id;
    });

    if (!socket.recovered) {
      try {
        // const user = req.user;
        
      } catch (e) {
        // something went wrong
        console.log(e);
      }
    }
  });
};

// module.exports= {webSocketConnect};
