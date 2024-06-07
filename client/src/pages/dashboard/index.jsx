import React, { useEffect, useRef, useState } from "react";
import avator from "../../assets/avator.jpg";
import PhoneIcon from "../../assets/icons/phone";
import Input from "../../components/input/index";
import SendIcon from "../../assets/icons/send";
import Container from "../../components/container/index";
import axios from "axios";
import { io } from "socket.io-client";
import dashboardStyles from "./styles";
import VerticalDotsIcon from "../../assets/icons/verticalDots";

import "./index.css";
import TrashIcon from "../../assets/icons/trash";
import PencilIcon from "../../assets/icons/pencilIcon";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState();
  const [updatedMessage, setUpdatedMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [dropDown, setDropDown] = useState();
  const messageRef = useRef();

  const handleDropDownMenu = (index) => {
    setDropDown((prevIndex) => (prevIndex === index ? null : index));
  };

  const dateFormatter = () => {
    const date = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedDate = formatter.format(date);

    return formattedDate;
  };

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers >>>", users);
    });

    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: Array.isArray(prev.messages)
          ? [
              ...prev.messages,
              {
                user: data.user,
                message: data.message,
                senderId: data.senderId,
                date: data.date,
                messageId: data.messageId,
              },
            ]
          : [
              {
                user: data.user,
                message: data.message,
                senderId: data.senderId,
                date: data.date,
                messageId: data.messageId,
              },
            ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("updateMessage", (data) => {
      console.log("updated message data >>>>", data);
      setMessages((prev) => ({
        ...prev,
        messages: prev?.messages.map((msg) =>
          msg.messageId === data.messageId
            ? { ...msg, message: data.updatedMessage, date: data.time }
            : msg
        ),
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

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    socket?.on("deleteMessage", ({ receiverId }) => {
      if (receiverId === loggedInUser.id) {
        const receiver = localStorage.getItem("receiver");

        if (receiver) {
          fetchMessages("new", JSON.parse(receiver));
        }
      }
    });
  }, [socket]);

  const fetchMessages = async (conversationId, user) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    const receiverId = user.user_id || user.receiverId;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/message/${conversationId}?senderId=${loggedInUser.id}&&receiverId=${receiverId}`
      );

      setMessages({ messages: res.data, receiver: user, conversationId });
    } catch (error) {
      console.log("Error From fetching Messages", error);
    } finally {
      localStorage.setItem("receiver", JSON.stringify(user));
    }
  };

  const sendMessage = async () => {
    const date = dateFormatter();
    // console.log("messages >>>", messages);
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    console.log("loggedInUser >>>", loggedInUser);

    try {
      const res = await axios.post("http://localhost:3000/api/message", {
        conversationId: messages?.conversationId,
        senderId: loggedInUser?.id,
        message: message,
        date: date,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
      });
      socket?.emit("sendMessage", {
        conversationId: messages?.conversationId,
        senderId: loggedInUser?.id,
        message: message,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
        date: date,
        messageId: res.data.insertId ? res.data.insertId : null,
      });
    } catch (error) {
      console.log("Error From storing message in DB ", error);
    } finally {
      setMessage("");
    }

    console.log("time >>>", date);
  };

  const updateDBMessage = async () => {
    const time = dateFormatter();
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    try {
      const updateResult = await axios.put(
        "http://localhost:3000/api/message",
        {
          message: editedMessage,
          id: updatedMessage?.messageId,
          time: time,
        }
      );
      console.log("updateResult >>>>", updateResult);
      socket?.emit("updateMessage", {
        updatedMessage: editedMessage,
        messageId: updatedMessage.messageId,
        senderId: loggedInUser?.id,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
        time: time,
      });
    } catch (error) {
      console.log("error from updating message >>>>", error);
    } finally {
      setUpdatedMessage(null);
      setEditedMessage("");
    }
  };

  const deleteMessage = async (message) => {
    const messageId = message.messageId;
    try {
      const res = await axios.delete("http://localhost:3000/api/message", {
        data: {
          id: messageId,
        },
      });
      socket?.emit("deleteMessage", {
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
      });
      console.log(res);
    } catch (error) {
      console.log("Error in deleting message >>>", error);
    } finally {
      const receiver = localStorage.getItem("receiver");

      if (receiver) {
        fetchMessages("new", JSON.parse(receiver));
      }
    }
  };

  useEffect(() => {
    const receiver = localStorage.getItem("receiver");

    if (receiver) {
      fetchMessages("new", JSON.parse(receiver));
    }
  }, []);

  return (
    <Container>
      <div className="flex h-full w-full  overflow-y-hidden ">
        <div className="w-[400px] h-full bg-[#fff9f9e0]">
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
                <p className="text-lg text-[#4d6bee] ">Messages</p>
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
        <div className="w-[75%] bg-white h-full flex flex-col items-center justify-between ">
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
                    return (
                      <>
                        <div
                          style={dashboardStyles.messageWrapperStyles}
                          className={`message-wrapper  ${item?.senderId !== user.id ? " bg-[#efefef] text-black rounded-tr-x mr-auto" : "bg-[#3797f0]  text-white ml-auto rounded-tl-xl"} max-w-[40%] w-fit  rounded-b-xl flex justify-center items-end  p-4 mb-6`}
                        >
                          <p style={dashboardStyles.paraMessageStyles}>
                            {item.message}
                          </p>
                          <div
                            className="time-stamp w-[50px] shrink-0 "
                            style={dashboardStyles.messageStyles}
                          >
                            {item.date}
                          </div>

                          <div
                            className={`${item?.senderId !== user.id ? " top-[5px] -right-[25px]" : "top-[11px] -left-[27px]"}  drop-down  absolute `}
                            onClick={() => {
                              handleDropDownMenu(i);
                            }}
                          >
                            <VerticalDotsIcon size={16} />
                          </div>
                          {dropDown === i ? (
                            <div
                              className={`${item?.senderId !== user.id ? " -right-[188px] top-[25px] " : "-left-[194px] top-[35px]"}  z-10 drop-down-menu shadow-lg absolute  rounded-md bg-[#fff] `}
                            >
                              <div
                                className="dropdown-btn delete-btn"
                                onClick={() => {
                                  deleteMessage(item);
                                  handleDropDownMenu(i);
                                }}
                              >
                                <p>Delete</p>
                                <span>
                                  <TrashIcon size={24} color={"red"} />
                                </span>
                              </div>

                              {item?.senderId === user.id ? (
                                <div
                                  className="dropdown-btn"
                                  onClick={() => {
                                    setUpdatedMessage(item);
                                    setEditedMessage(item.message);
                                    handleDropDownMenu(i);
                                  }}
                                >
                                  <p style={{ color: "grey" }}>Edit</p>
                                  <span>
                                    <PencilIcon size={24} color={"grey"} />
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>

                        <div ref={messageRef}></div>
                      </>
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
          {messages !== undefined && updatedMessage === null ? (
            <div className="input-field p-2 w-full flex justify-center items-center ">
              <Input
                placeholder={"Type a message....."}
                type={"text"}
                containerClass={"w-full input-container"}
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
          {messages !== undefined && updatedMessage !== null ? (
            <div className="input-field p-2 w-full flex justify-center items-center ">
              <Input
                placeholder={"Type a message....."}
                type={"text"}
                containerClass={"w-full input-container"}
                value={editedMessage}
                onChange={(e) => {
                  setEditedMessage(e.target.value);
                }}
                inputClass={"rounded-full outline-none"}
              />
              <div
                className={`cursor-pointer  ${editedMessage === "" ? "pointer-events-none" : ""}`}
                onClick={() => {
                  updateDBMessage();
                }}
              >
                <SendIcon size={"30"} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
