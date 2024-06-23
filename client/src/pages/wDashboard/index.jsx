import React from "react";
import SideBar from "./conponents/sideBar";
import { Outlet } from "react-router-dom";
const WhatsAppDashboard = () => {
  return (
    <div className=" w-full h-full flex flex-shrink-0   relative">
      <SideBar />
      <div className="flex w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
