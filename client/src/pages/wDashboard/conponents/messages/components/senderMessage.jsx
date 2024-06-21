import React from "react";

const SenderMessage = ({ data }) => {
  return (
    <div className={`w-full flex justify-start mb-2 relative`}>
      <div className="receiver rounded-lg rounded-tl-none bg-white pl-[9px] pr-[9px] flex datas-center pt-[6px] pb-2 max-w-[40%] w-fit text-[14px] ">
        <p style={{ wordBreak: "break-all" }}>{data.message}</p>
        <span className="text-[10px] -mb-3 ml-5">{data.time}</span>
      </div>
    </div>
  );
};

export default SenderMessage;
