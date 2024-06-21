import React from "react";
import "./index.css";
const DeleteAlert = ({ setDeleteMessage, deleteDBMessage, item }) => {
  return (
    <div className="delete-alert flex justify-center items-center  absolute top-0 bottom-0 left-0 right-0 z-50 w-ful h-full ">
      <div className="bg-white w-[400px] rounded-md shadow-md  overflow-hidden ">
        <div className="pl-5 pb-6 pt-6">
          <p className="text-[20px] text-[#373737] font-semibold mb-2">
            Delete Message?
          </p>
          <p className="text-[14px] mt-1">
            Are you sure you want to delete the message ?
          </p>
        </div>
        <div className="pl-5 pr-4 pb-6 pt-6 bg-[#f3f3f3] border-t rounded-br-md rounded-bl-md">
          <button
            onClick={() => {
              deleteDBMessage(item);
              setDeleteMessage(false);
            }}
            className="pt-0.5 mr-2 pb-0.5 rounded-md shadow-md w-[165px] text-white bg-[#1b8755] hover:bg-[#47b883]"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setDeleteMessage(false);
            }}
            className="pt-0.5  pb-0.5 w-[165px] rounded-md shadow-md text-black bg-[#fbfbfb] hover:bg-[#f6f6f6]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
