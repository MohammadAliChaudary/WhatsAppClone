import { useContext } from "react";
import MessageContext from "../contexts/messagesProvider";
const useMessage = () => {
  return useContext(MessageContext);
};

export default useMessage;
