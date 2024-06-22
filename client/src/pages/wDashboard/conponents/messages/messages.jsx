import React, { useEffect, useState } from "react";
import WhatsAppIcon from "../../../../assets/icons/whatspp";
import LockIcon from "../../../../assets/icons/lock";
import avator from "../../../../assets/avator.jpg";
import VideoIcon from "../../../../assets/icons/video";
import PhoneIcon from "../../../../assets/icons/phone";
import SearchIcon from "../../../../assets/icons/search";
import PaperClipIcon from "../../../../assets/icons/paperClip";
import InputSearch from "../../../../components/searchInput/index";
import MicrophoneIcon from "../../../../assets/icons/microphone";
import EmojiIcon from "../../../../assets/icons/emoji";
import { io } from "socket.io-client";
import useMessages from "../../../../hooks/useMessages";
import SendIcon from "../../../../assets/icons/send";
import axios from "axios";
import AngleDawnIcon from "../../../../assets/icons/angleDown";
import TrashIcon from "../../../../assets/icons/trash";
import editIcon from "../../../../assets/images/edit.svg";
import TickIcon from "../../../../assets/icons/tick";
import CrossIcon from "../../../../assets/icons/cross";
import PencilIcon from "../../../../assets/icons/pencilIcon";
import DeleteAlert from "../../../../components/deleteAlert/deleteAlert";
import "./index.css";
import ViewImage from "./components/viewImage";

const Messages = () => {
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );

  const receiver = localStorage.getItem("receiver");

  const [message, setMessage] = useState("");

  const { messages, setMessages } = useMessages();

  const [socket, setSocket] = useState();

  const [dropdown, setDropDown] = useState();

  const [editMessage, setEditMessage] = useState("");

  const [editMessageValue, setEditMessageValue] = useState(null);

  const [deleteMessage, setDeleteMessage] = useState(false);

  const [item, setItem] = useState(null);

  const [viewDp, setViewDp] = useState(false);

  const timeFormatter = () => {
    const time = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedTime = formatter.format(time);

    return formattedTime;
  };

  const dateFromatter = () => {
    const date = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const formateDate = formatter.format(date);

    return formateDate;
  };

  const handleDropDownMenu = (index) => {
    setDropDown((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", loggedInUser?.id);
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
                time: data.time,
                messageId: data.messageId,
                date: data.date,
              },
            ]
          : [
              {
                user: data.user,
                message: data.message,
                senderId: data.senderId,
                time: data.time,
                messageId: data.messageId,
                date: data.date,
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
            ? { ...msg, message: data.updatedMessage, time: data.time }
            : msg
        ),
      }));
    });
  }, [socket]);

  const sendMessage = async () => {
    const time = timeFormatter();
    const date = dateFromatter();
    // console.log("messages >>>", messages);
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    console.log("loggedInUser >>>", loggedInUser);

    try {
      const res = await axios.post("http://localhost:3000/api/message", {
        conversationId: messages?.conversationId || "new",
        senderId: loggedInUser?.id,
        message: message,
        time: time,
        date: date,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
      });
      socket?.emit("sendMessage", {
        conversationId: messages?.conversationId || "new",
        senderId: loggedInUser?.id,
        message: message,
        date: date,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
        time: time,
        messageId: res.data.insertId ? res.data.insertId : null,
      });
    } catch (error) {
      console.log("Error From storing message in DB ", error);
    } finally {
      setMessage("");
    }

    console.log("time >>>", time);
    console.log("date >>>", date);
  };

  const updateDBMessage = async () => {
    const time = timeFormatter();
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    try {
      const updateResult = await axios.put(
        "http://localhost:3000/api/message",
        {
          message: editMessage,
          id: editMessageValue?.messageId,
          time: time,
        }
      );
      console.log("updateResult >>>>", updateResult);
      socket?.emit("updateMessage", {
        updatedMessage: editMessage,
        messageId: editMessageValue.messageId,
        senderId: loggedInUser?.id,
        receiverId:
          messages?.receiver?.user_id || messages?.receiver?.receiverId,
        time: time,
      });
    } catch (error) {
      console.log("error from updating message >>>>", error);
    } finally {
      setEditMessageValue(null);
      setEditMessage("");
    }
  };

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

  const deleteDBMessage = async (message) => {
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

  useEffect(() => {
    const receiver = localStorage.getItem("receiver");

    if (receiver) {
      fetchMessages("new", JSON.parse(receiver));
    }
  }, []);

  if (messages) {
    return (
      <React.Fragment>
        {deleteMessage ? (
          <DeleteAlert
            setDeleteMessage={setDeleteMessage}
            deleteDBMessage={deleteDBMessage}
            item={item}
          />
        ) : null}
        {viewDp ? <ViewImage image={avator} setViewImage={setViewDp} /> : null}
        <div
          className={`flex-grow messages-container flex flex-col shrink-0 bg-[#fcfcfc] h-full `}
        >
          <header className="flex justify-between items-center border bg-white pr-4 pl-4 pt-[10px] pb-[10px]">
            <div className="flex justify-center items-center">
              <div
                onClick={() => {
                  setViewDp(true);
                }}
                className="ml-1 mr-3 cursor-pointer"
              >
                <img
                  className="w-[40px] h-[40px] rounded-full"
                  src={avator}
                  alt=""
                />
              </div>
              <span className="text-[14px] font-semibold">
                {messages?.receiver?.fullName}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex border rounded">
                <span className="pl-3 pr-3 pt-2 pb-2 hover:bg-[#ECEDEA]">
                  <VideoIcon size={22} color="#000" />
                </span>
                <hr className=" border-l bg-transparent outline-0 border-red h-[25px] mt-[6px] " />
                <span className="pl-3 pr-3 pt-2 pb-2 hover:bg-[#ECEDEA]">
                  <PhoneIcon size={22} color="#000" />
                </span>
              </div>
              <span className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]">
                <SearchIcon size={18} color="#000" />
              </span>
            </div>
          </header>
          <div className="pb-3 w-full h-full chat-area-container">
            <div className="chat-area relative w-full h-full overflow-y-scroll ">
              <div className=" w-full pl-[165px] absolute top-0 bottom-0  h-full pr-[165px] flex flex-col max-xl:pl-[100px] max-xl:pr-[100px] max-[1055px]:pl-[40px] max-[1055px]:pr-[40px] max-[470px]:pl-[10px] max-[470px]:pr-[10px]">
                <div className="space"></div>
                <div className="w-full flex justify-center items-center mb-3">
                  <span className="flex justify-center items-center   p-1 rounded border border-[#feefd5] bg-[#feefd5] hover:border-[#dfd2bb] cursor-pointer">
                    <p className=" flex justify-center items-center text-[11px] select-none">
                      <span className="mr-[3px]">
                        <LockIcon size={15} color="#acabab" />
                      </span>
                      Messages to yourself are end-to-end encrypted. No one
                      outside of this chat, not even WhatsApp, can read or
                      listen to them. Click to learn more
                    </p>
                  </span>
                </div>
                {messages?.messages?.map((item, i) => (
                  <>
                    {item.senderId !== loggedInUser.id ? (
                      <div
                        className={` receiver-message w-full flex justify-start items-center mb-2 relative`}
                      >
                        <div className="receiver-message-inner  flex  justify-start items-center mb-2 relative  max-w-[65%] w-fit">
                          <div className="receiver rounded-lg rounded-tl-none bg-white pl-[9px] pr-[9px] flex items-center pt-[6px] pb-2 text-[14px] ">
                            <p style={{ wordBreak: "break-all" }}>
                              {item.message}
                            </p>
                            <span className="text-[10px] h-full align-bottom ml-5 shrink-0 relative -bottom-[8px]">
                              {item.time}
                            </span>
                          </div>
                          <div className="relative">
                            <div
                              onClick={() => {
                                handleDropDownMenu(i);
                              }}
                              className=" receiver-message-dropdown-btn flex ml-[10px] border  border-[#eeeae8] p-1.5 rounded-3xl bg-[#fdfcfc] hover:bg-[#f3f2f1]"
                            >
                              <span className="w-[12px] mr-1.5 text-red-50 ">
                                <AngleDawnIcon />
                              </span>
                              <span>
                                <EmojiIcon size={15} />
                              </span>
                            </div>

                            {dropdown === i ? (
                              <div className=" w-[275px] shrink-0 absolute -top-[60px] -left-[89px] p-1 border border-[#ddd9d8] rounded-md  shadow-md  bg-[#f6f3f2] ">
                                <div
                                  onClick={() => {
                                    setDeleteMessage(true);
                                    handleDropDownMenu(i);
                                    setItem(item);
                                  }}
                                  className="flex justify-start items-center rounded hover:bg-[#ede9e3]"
                                >
                                  <span className="p-2 mr-1">
                                    <TrashIcon size={24} color={"#000"} />
                                  </span>
                                  <span>Delete</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full flex justify-end relative mb-2`}>
                        <div className="sender-message-inner shrink-0 flex  justify-end items-center  mb-2 relative  max-w-[65%] w-fit">
                          <div className=" relative">
                            <div
                              onClick={() => {
                                handleDropDownMenu(i);
                              }}
                              className="  sender-message-dropdown-btn flex mr-[10px] border  border-[#eeeae8] p-1.5 rounded-3xl bg-[#fdfcfc] hover:bg-[#f3f2f1]"
                            >
                              <span className="mr-1.5  ">
                                <EmojiIcon size={15} />
                              </span>
                              <span className="w-[12px] ">
                                <AngleDawnIcon />
                              </span>
                            </div>
                            {dropdown === i ? (
                              <div className=" w-[275px] shrink-0 absolute -top-[108px] -left-[116px] p-1 border border-[#ddd9d8] rounded-md  shadow-md  bg-[#f6f3f2] ">
                                <div
                                  onClick={() => {
                                    setDeleteMessage(true);
                                    handleDropDownMenu(i);
                                    setItem(item);
                                  }}
                                  className="flex justify-start items-center rounded hover:bg-[#ede9e3]"
                                >
                                  <span className="p-2 mr-1">
                                    <TrashIcon size={24} color={"#000"} />
                                  </span>
                                  <span>Delete</span>
                                </div>
                                <div
                                  onClick={() => {
                                    setEditMessage(item.message);
                                    setEditMessageValue(item);
                                    handleDropDownMenu(i);
                                  }}
                                  className="flex justify-start items-center rounded hover:bg-[#ede9e3]"
                                >
                                  <span className="p-2 mr-1">
                                    <img
                                      className="w-[22px] h-[22px]"
                                      src={editIcon}
                                      alt=""
                                    />
                                  </span>
                                  <span>Edit</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div className="sender rounded-lg rounded-tr-none bg-[#d9fdd3]  pl-[9px] pr-[9px] flex items-center pt-[6px] pb-2 ml-auto text-[14px] ">
                            <p style={{ wordBreak: "break-all" }}>
                              {item.message}
                            </p>
                            <span className="text-[10px] -mb-3 ml-5">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
          <footer className="bg-white border-t  pr-4 pl-4 pt-1 pb-1 ">
            {editMessageValue !== null ? (
              <div className="">
                <div className="pt-2 ">
                  <div className="flex mb-0.5 justify-start pt-1 pb-1 shadow-md items-center rounded-lg border border-[#e6eae4] w-[95.5%] ml-auto bg-[#e7ffdb] ">
                    <span className="pl-3 pr-3 pt-[8px] pb-[8px]">
                      <PencilIcon size={22} color={"#248c5b"} />
                    </span>
                    <div className="flex flex-col w-full flex-wrap ">
                      <h6 className="text-[11px] font-[700]    text-[#248c5b] h-fit">
                        Edit message
                      </h6>
                      <p className="text-[12px] -mt-0.5 w-[98%] break-all ">
                        {editMessageValue.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <span className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]">
                      <EmojiIcon size={21} />
                    </span>
                  </div>
                  <div className="w-full">
                    <InputSearch
                      wrapperClass={"send-message-input"}
                      type={"text"}
                      placeholder={"Type a message"}
                      value={editMessage}
                      onChange={(e) => {
                        setEditMessage(e.target.value);
                      }}
                    />
                  </div>
                  <div
                    onClick={() => {
                      setEditMessage("");
                      setEditMessageValue(null);
                    }}
                    className="  ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]"
                  >
                    <CrossIcon size={21} color="#000" />
                  </div>
                  <div
                    onClick={() => {
                      updateDBMessage();
                    }}
                    className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]"
                  >
                    <TickIcon size={21} color="#000" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="flex">
                  <span className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]">
                    <EmojiIcon size={24} />
                  </span>
                  <span className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]">
                    <PaperClipIcon size={22} color="#000" />
                  </span>
                </div>
                <div className="w-full">
                  <InputSearch
                    wrapperClass={"send-message-input"}
                    type={"text"}
                    placeholder={"Type a message"}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                </div>
                {message === "" ? (
                  <div className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]">
                    <MicrophoneIcon size={22} color="#000" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      sendMessage();
                    }}
                    className=" ml-1 rounded pl-3 pr-3 pt-[10px] pb-[10px] hover:bg-[#ECEDEA]"
                  >
                    <SendIcon size={22} color="#000" />
                  </div>
                )}
              </div>
            )}
          </footer>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div
        style={{ width: "-webkit-fill-available" }}
        className={` absolute flex flex-col justify-center items-center left-[525px] bg-[#fcfcfc] h-full ${receiver ? "" : "max-[940px]:hidden"} `}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="h-[55%] flex items-end">
            <div className="flex  flex-col items-center">
              <span>
                <WhatsAppIcon size={80} color="#dadada" />
              </span>
              <span className=" mt-3 mb-3">
                <p className="text-[19px] select-none font-normal">
                  WhatsApp for Windows
                </p>
              </span>
              <p className=" select-none text-center text-[13px] text-[#858484]">
                Send and receive messages without keeping your phone online{" "}
                <br /> Use WhatsApp on up to 4 linked devices and 1 phone at the
                same time
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center pt-5 pb-11">
            <span className=" mr-2">
              <LockIcon size={15} color="#acabab" />
            </span>
            <p className=" select-none text-[14px] text-[#acabab]">
              End-to-end encrypted
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default Messages;
