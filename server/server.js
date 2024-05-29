const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const db = require("./config/dbConfig");

const dbHelper = require("./utils/dbUtils");

const bcryptUtils = require("./utils/bcryptUtils");

const jwtHelper = require("./utils/jwtUtils");

// Sockets

let users = [];
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    console.log("userId >>",userId);
    const isUSerExist = users.find((user) => user.userId === userId);
    console.log("isUSerExist >>>",!users.some((user) => user.userId === userId));
    if (!users.some((user) => user.userId === userId)) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, message, receiverId }) => {
      console.log("data >>>", conversationId, senderId, message, receiverId);
     
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const senderUser = await dbHelper.getUser("id", senderId);
      console.log("receiver", receiver);
      console.log("sender", sender);
      if (receiver!== undefined) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            conversationId,
            senderId,
            message,
            receiverId,
            user: {
              fullName: senderUser[0].user_name,
              email: senderUser[0].email,
            },
          });
      } else if(receiver === undefined){
        io.to(sender.socketId)
          .emit("getMessage", {
            conversationId,
            senderId,
            message,
            receiverId,
            user: {
              fullName: senderUser[0].user_name,
              email: senderUser[0].email,
            },
          });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

app.post("/api/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).send("Please fill all require fields");
  }

  const isAlreadyExist = await dbHelper.checkForDuplicateUser("email", email);

  if (isAlreadyExist) {
    return res.status(400).send("User already exist");
  }

  const hashedpwd = await bcryptUtils.hashedString(password, 10);

  // console.log("i am here");

  const values = [fullName, email, hashedpwd];
  // console.log(values);
  const query =
    "INSERT INTO user (`user_name`,`email`,`password`) values(?,?,?)";
  db.query(query, values, (err, result) => {
    if (err) {
      return console.log(err);
    } else {
      return res.json({
        status: "success",
        message: "New account created",
        data: result,
      });
    }
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please fill all require fields");
  }

  const user = await dbHelper.getUser("email", email);

  if (user.length === 0) {
    return res.status(400).send("User email or password is in correct");
  }

  // console.log("user >>>", user[0]);

  const isValidatedUser = await bcryptUtils.compareString(
    user[0].password,
    password
  );

  if (!isValidatedUser) {
    return res.status(400).send("User email or password is in correct");
  }

  // console.log("isValidateUser >>>", isValidatedUser);

  const tokenParams = {
    payload: {
      userId: user[0].id,
      email: user[0].email,
    },
    secretKey: process.env.REFRESH_TOKEN || "JWT_SECRET_KEY",
    expiresIn: 84600,
  };

  const token = jwtHelper.createToken(tokenParams);

  // console.log("Token >>>", token);

  const updateToken = await dbHelper.updateRefreshToken(token, user[0].id);

  // console.log("UpdateToken", updateToken);

  if (updateToken === "success")
    return res.json({
      user: {
        fullName: user[0].user_name,
        email: user[0].email,
        id: user[0].id,
      },
      token: token,
    });

  return res.status(400).send("Something went wrong");
});

app.post("/api/conversation", async (req, res) => {
  const { senderId, receiverId } = req.body;

  const values = [senderId, 2];
  console.log(senderId,receiverId);

  const addConversation = await dbHelper.createConversation(values);

  if (addConversation === "success") {
    return res.status(200).send("Conversation created successfully");
  }
});

app.get("/api/conversation/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log("I am here");
  const conversation = await dbHelper.getConversation(userId);
  // console.log("conversation >>>", conversation);
  const converSationUserData = Promise.all(
    conversation.map(async (element) => {
      const receiverId = [element.user_id, element.receiver_id].find(
        (id) => id !== parseInt(userId)
      );
      const user = await dbHelper.getUser("id", receiverId);
      // console.log("user >>>", user);
      return {
        user: {
          email: user[0].email,
          fullName: user[0].user_name,
          user_id: user[0].id,
        },
        conversationId: element._id,
      };
    })
  );


  return res.status(200).json(await converSationUserData);
});

app.post("/api/message", async (req, res) => {
  const { conversationId, senderId, message, receiverId } = req.body;
  console.log("Body >>>",req.body);

  if (!senderId || !message) {
    return res.status(400).send("requirments is not completed ");
  }

  if (conversationId === "new") {
    const conversationValues = [senderId, receiverId];

    const creatingConversation = await dbHelper.createConversation(
      conversationValues
    );

    const newConversationId = creatingConversation.result.insertId;

    // console.log("newConversationId >>>", newConversationId);

    if (creatingConversation.message === "success") {
      const messageValues = [newConversationId, senderId, message];

      const storingMessageInDB = await dbHelper.storingMessagesInDB(
        messageValues
      );

      console.log("storingMessageInDB >>>", storingMessageInDB);

      if (storingMessageInDB === "success") {
        return res.status(200).send("Message store successfully");
      }
    }
  }

  const values = [conversationId, senderId, message];

  const storingMessageInDB = await dbHelper.storingMessagesInDB(values);

  if (storingMessageInDB === "success") {
    return res.status(200).send("Message store successfully");
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { senderId, receiverId } = req.query;
  const values = [senderId, receiverId, receiverId, senderId];
  // console.log("Ids >>>", senderId, receiverId);

  const checkMessages = async (conversationId) => {
    const messages = await dbHelper.getMessage(
      "conversation_id",
      conversationId
    );
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await dbHelper.getUser("id", message.sender_id);
        return {
          user: { email: user[0].email, fullName: user[0].user_name },
          message: message.message,
          senderId: message.sender_id,
        };
      })
    );
    return res.status(200).json(await messageUserData);
  };

  if (conversationId === "new") {
    const checkConversation = await dbHelper.checkForConversation(values);
    // console.log("checkConversation >>>", checkConversation);
    if (checkConversation.length > 0) {
      checkMessages(checkConversation[0]._id);
    } else {
      return res.status(200).json([]);
    }
  } else {
    checkMessages(conversationId);
  }
});

app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  const users = await dbHelper.getfilteredUsers(id);

  const usersRequiredData = Promise.all(
    users.map(async (user) => {
      return {
        user: {
          email: user.email,
          fullName: user.user_name,
          receiverId: user.id,
        },
      };
    })
  );

  return res.status(200).json(await usersRequiredData);
});

app.listen(3000, () => {
  console.log("listening to the Port ", 3000);
});
