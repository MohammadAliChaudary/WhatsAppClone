import React from "react";

const Container = ({ children }) => {
  return (
    <div className="h-screen bg-[#f3f2f2] flex justify-center items-center">
      {children}
    </div>
  );
};

export default Container;
