import React from "react";
import Messages from "../messages/messages";
import Conversation from "../conversations";

const Chats = () => {
  return (
    <React.Fragment>
      <Conversation />
      <Messages />
    </React.Fragment>
  );
};

export default Chats;
