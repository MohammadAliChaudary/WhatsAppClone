import React, { useEffect, useState } from "react";
import SideBar from "./conponents/sideBar";
import Conversation from "./conponents/conversations";
import Messages from "./conponents/messages/messages";
import axios from "axios";

const WhatsAppDashboard = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <div className=" w-full h-full flex flex-shrink-0   relative">
      <SideBar />
      <Conversation users={users} />
      <Messages />
    </div>
  );
};

export default WhatsAppDashboard;
