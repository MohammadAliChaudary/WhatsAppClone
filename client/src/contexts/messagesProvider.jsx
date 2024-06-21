import { createContext, useState } from "react";

const MessageContext = createContext({});

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState();
  console.log("i am  here");
  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
