import React from "react";
import EditIcon from "../../../../assets/images/edit.svg";
import menuIcon from "../../../../assets/images/menu.svg";
import InputSearch from "../../../../components/searchInput";
import SearchIcon from "../../../../assets/icons/search";
import avator from "../../../../assets/avator.jpg";
import axios from "axios";
import useMessage from "../../../../hooks/useMessages";

const Conversation = ({ users }) => {
  const { setMessages } = useMessage();
  const receiver = localStorage.getItem("receiver");

  // console.log("Custom Hook >>>", messages, setMessages);
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

  return (
    <div
      className={` absolute z-0 left-[45px] bg-[#fefefe] h-full w-[480px] min-w-[20%] border p-3`}
    >
      <div className="header mb-3">
        <div className="flex justify-between items-center p-1">
          <p className="text-[20px] font-semibold">Chats</p>
          <div className="flex">
            <span className="p-3 shrink-0 mr-1 transition-all rounded hover:bg-[#ECEDEA] ">
              <img
                className="w-[18px] h-[18px]"
                src={EditIcon}
                alt=""
                srcset=""
              />
            </span>
            <span className="shrink-0 p-3 transition-all rounded hover:bg-[#ECEDEA] ">
              <img
                className="w-[18px] h-[18px]"
                src={menuIcon}
                alt=""
                srcset=""
              />
            </span>
          </div>
        </div>
        <div>
          <InputSearch
            icon={<SearchIcon size={14} color="#5e5d5d" />}
            placeholder={"Searh or start new chat"}
            type={"search"}
          />
        </div>
      </div>
      <div className="conversations  w-full h-full overflow-y-scroll">
        <div className="">
          {users.map(({ user }, i) => (
            <div
              key={i}
              onClick={() => {
                fetchMessages("new", user);
              }}
              className="flex flex-wrap justify-start items-center pt-3 pb-3 rounded-md hover:bg-[#f4f4f4]"
            >
              <div className="dp shrink-0 pl-[14px] pr-[15px] ">
                <img
                  className="w-[49px] h-[49px] rounded-full"
                  src={avator}
                  alt=""
                  srcset=""
                />
              </div>
              <div className="info shrink-0 grow pr-[14px]">
                <div className="flex justify-between items-center">
                  <p className="text-[14px] font-bold">{user.fullName}</p>
                  <span className="text-[12px] text-gray-500">10:00 AM</span>
                </div>
                <div>
                  <p className="text-[14px] text-gray-600">
                    Last message sent by you
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
