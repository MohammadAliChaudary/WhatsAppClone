import React, { useEffect, useState } from "react";
import avator from "../../assets/avator.jpg";
import PhoneIcon from "../../assets/icons/phone";
import Input from "../../components/input/index";
import SendIcon from "../../assets/icons/send";
import Container from "../../components/container/index";
import axios from "axios";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState();

 

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers >>>", users);
    });

    socket?.on("getMessage", (data) => {
      console.log("data >>>", data);
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message, senderId:data.senderId },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/conversation/${loggedInUser.id}`
        );
        setConversation(res.data);
      } catch (error) {
        console.log("Error From fetching Conversations", error);
      }
    };
    fetchConversation();
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/${loggedInUser.id}`
        );

        setUsers(res.data);
      } catch (error) {
        console.log("Error From fetching Users", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchMessages = async (conversationId, user) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
 
     const receiverId = user.user_id || user.receiverId


    try {
      const res = await axios.get(
        `http://localhost:3000/api/message/${conversationId}?senderId=${loggedInUser.id}&&receiverId=${receiverId}`
      );

      setMessages({ messages: res.data, receiver: user, conversationId });
    } catch (error) {
      console.log("Error From fetching Messages", error);
    }
  };

  const sendMessage = async () => {
    console.log("messages >>>", messages);
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

console.log("loggedInUser >>>",loggedInUser);
    socket?.emit("sendMessage", {
      conversationId: messages?.conversationId,
      senderId: loggedInUser?.id,
      message: message,
      receiverId: messages?.receiver?.user_id || messages?.receiver?.receiverId,
    });


    
    try {
      const res = await axios.post("http://localhost:3000/api/message", {
        conversationId: messages?.conversationId,
        senderId: loggedInUser?.id,
        message: message,
        receiverId:messages?.receiver?.user_id || messages?.receiver?.receiverId ,
      });
      console.log("res >>>", res);
    } catch (error) {
      console.log("Error From storing message in DB ", error);
    } finally {
      setMessage("");
    }
  };

  return (
    <Container>
      <div className="flex h-full w-full  overflow-y-hidden ">
        <div className="w-[25%] h-full bg-[#fff9f9e0]">
          <div className="h-full w-full pt-3 pb-3">
            <div className="flex justify-center  border-b-[1px] cursor-pointer  items-center p-5">
              <div className="avator mr-6 flex justify-center items-center overflow-hidden rounded-full w-[75px] p-[2px] h-[75px] border-2 border-rose-600 ">
                <img src={avator} alt="dp" className="w-full h-full  rounded" />
              </div>
              <div className="name-wrapper">
                <h1 className="text-2xl mb-[6px]">{user.fullName}</h1>
                <p className="text-lg font-light">{user.email}</p>
              </div>
            </div>
            <div className="mx-14 mt-10 h-[78%]  overflow-y-scroll">
              <div>
                <p className="text-lg text-[#4d6bee]">Messages</p>
                {conversation.length !== 0 ? (
                  <div>
                    {conversation.map(({ user, conversationId }, i) => {
                      return (
                        <React.Fragment key={i}>
                          <div
                            className="flex hover:bg-[#d4d4d4] border-b-[1px] cursor-pointer items-center p-5  pl-0"
                            onClick={() => {
                              fetchMessages(conversationId, user);
                            }}
                          >
                            <div className="avator mr-6 flex justify-center items-center overflow-hidden rounded-full w-[75px] p-[2px] h-[75px] border-2 border-rose-600 ">
                              <img
                                src={avator}
                                alt="dp"
                                className="w-full h-full  rounded"
                              />
                            </div>
                            <div className="name-wrapper">
                              <h1 className="text-xl mb-[6px]">
                                {user.fullName}
                              </h1>
                              <p className="text-sm font-light">{user.email}</p>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className=" text-lg text-center font-semibold mt-24">
                    No Conversation yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50%] bg-white h-full flex flex-col items-center ">
          {messages !== undefined ? (
            <div className="user-info w-[75%] h-[80px] shadow-lg mt-10 rounded-full bg-[#fff9f9e0] flex justify-between items-center px-5">
              <div className="flex cursor-pointer items-center   ">
                <div className="avator mr-2 flex justify-center items-center overflow-hidden rounded-full w-[50px] p-[2px] h-[50px] border-2 border-rose-600 ">
                  <img
                    src={avator}
                    alt="dp"
                    className="w-full h-full  rounded"
                  />
                </div>
                <div className="name-wrapper">
                  <h1 className="text-xl mb-[2px]">
                    {messages?.receiver?.fullName}
                  </h1>
                  <p className="text-sm font-light">
                    {messages?.receiver?.email}
                  </p>
                </div>
              </div>
              <div className="phone-icon">
                <PhoneIcon size={24} color={"currentColor"} />
              </div>
            </div>
          ) : null}
          <div className="messages overflow-x-hidden h-[75%] w-full overflow-scroll  ">
            <div className="w-full px-10 py-14   ">
              {messages !== undefined ? (
                <React.Fragment>
                  {messages?.messages?.map((item, i) => {
                    // console.log("messages >>>", item.senderId);
                    // console.log("SenderId >>>", item.senderId);
                    // console.log("UserrID >>>", user.id);
                    // console.log("comparison >>>", item.senderId !== user.id);
                    return (
                      <div
                        className={`sender ${item?.senderId !== user.id ? " bg-[#efefef] text-black rounded-tr-x mr-auto" : "bg-[#3797f0]  text-white ml-auto rounded-tl-xl"} max-w-[40%]  rounded-b-xl  p-4 mb-6`}
                      >
                        <p>{item.message}</p>
                      </div>
                    );
                  })}
                </React.Fragment>
              ) : (
                <div className="w-full h-full flex justify-center items-center  text-4xl">
                  Send message to start the Conversation
                </div>
              )}
            </div>
          </div>
          {messages !== undefined ? (
            <div className="input-field p-14 w-full flex justify-center items-center ">
              <Input
                placeholder={"Type a message....."}
                type={"text"}
                containerClass={"w-full mb-0"}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                inputClass={"rounded-full outline-none"}
              />
              <div
                className={`cursor-pointer  ${message === "" ? "pointer-events-none" : ""}`}
                onClick={() => {
                  sendMessage();
                }}
              >
                <SendIcon size={"30"} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-[25%] h-screen px-8 py-24">
          <p className="text-lg text-[#4d6bee]">Messages</p>
          {users.length !== 0 ? (
            <div>
              {users.map(({ user }, i) => {
                return (
                  <React.Fragment key={i}>
                    <div
                      className="flex hover:bg-[#d4d4d4] border-b-[1px] cursor-pointer items-center p-5  pl-0"
                      onClick={() => {
                        fetchMessages("new", user);
                      }}
                    >
                      <div className="avator mr-6 flex justify-center items-center overflow-hidden rounded-full w-[75px] p-[2px] h-[75px] border-2 border-rose-600 ">
                        <img
                          src={avator}
                          alt="dp"
                          className="w-full h-full  rounded"
                        />
                      </div>
                      <div className="name-wrapper">
                        <h1 className="text-xl mb-[6px]">{user.fullName}</h1>
                        <p className="text-sm font-light">{user.email}</p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div className=" text-lg text-center font-semibold mt-24">
              No Conversation yet
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
