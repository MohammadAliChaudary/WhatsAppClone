import React from "react";
import { IconX } from "@tabler/icons-react";
const ViewImage = ({ image, setViewImage }) => {
  return (
    <div className=" bg-black z-20 absolute top-0 left-0  right-0 bottom-0 w-full h-full">
      <div
        className="flex justify-start items-center p-4"
        onClick={() => {
          setViewImage(false);
        }}
      >
        <IconX stroke={1.5} color="#ffff" size={32} />
      </div>
      <div className="w-full h-full flex justify-center items-center bg-black">
        <img src={image} alt="" className="w-[40%]" />
      </div>
    </div>
  );
};

export default ViewImage;
