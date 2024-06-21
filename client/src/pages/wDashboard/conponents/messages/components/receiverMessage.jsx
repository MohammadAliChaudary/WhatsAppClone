import React from "react";

const ReceiverMessage = ({ data }) => {
  return (
    <div className={`w-full flex justify-start mb-2`}>
      <div className="sender rounded-lg rounded-tr-none bg-[#d9fdd3]  pl-[9px] pr-[9px] flex datas-center pt-[6px] pb-2 ml-auto max-w-[40%] w-fit text-[14px] ">
        <p style={{ wordBreak: "break-all" }}>{data.message}</p>
        <span className="text-[10px] -mb-3 ml-5">{data.time}</span>
      </div>
    </div>
  );
};

export default ReceiverMessage;
