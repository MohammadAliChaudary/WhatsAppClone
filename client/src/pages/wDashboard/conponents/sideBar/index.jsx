import React, { useEffect, useRef } from "react";
import MenuIcon from "../../../../assets/icons/menu";
import ChatIcon from "../../../../assets/icons/chat";
import PhoneIcon from "../../../../assets/icons/phone";
import StatusIcon from "../../../../assets/icons/status";
import aiIcon from "../../../../assets/images/ai-icon.png";
import ArchievIcon from "../../../../assets/icons/archive";
import SettingIcon from "../../../../assets/icons/delete";
import avator from "../../../../assets/avator.jpg";
import StarIcon from "../../../../assets/icons/star";
import "./index.css";

const SideBar = () => {
  const wrapperRef = useRef();

  const toggleButtonRef = useRef();

  const topMenu = [
    {
      icon: <MenuIcon size={20} color={"#000"} />,
      text: null,
      iconType: "svg",
      class: "svg-icon-tab",
      ref: toggleButtonRef,
    },
    {
      icon: <ChatIcon size={21} color={"#000"} />,
      text: "Chats",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: <PhoneIcon size={20} color={"#000"} />,
      text: "Calls",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: <StatusIcon size={22} color={"#000"} />,
      text: "Status",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: aiIcon,
      text: "Meta AI",
      iconType: "image",
      class: "image-icon-tab",
    },
  ];

  const bottomMenu = [
    {
      icon: <StarIcon size={22} color={"#000"} />,
      text: "Starred messages",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: <ArchievIcon size={22} color={"#0000"} />,
      text: "Archived chats",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: <SettingIcon size={22} color={"#000"} />,
      text: "Settings",
      iconType: "svg",
      class: "svg-icon-tab",
    },
    {
      icon: avator,
      text: "Profile",
      iconType: "image",
      class: "image-icon-tab",
    },
  ];

  useEffect(() => {
    const handleToggleClick = (event) => {
      event.stopPropagation();
      wrapperRef.current.classList.toggle("side-bar-container-open");
    };

    const handleWindowClick = (event) => {
      if (wrapperRef.current.classList.contains("side-bar-container-open")) {
        wrapperRef.current.classList.remove("side-bar-container-open");
      }
    };

    const toggleButton = toggleButtonRef.current;
    const wrapper = wrapperRef.current;

    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", handleToggleClick);
      window.addEventListener("click", handleWindowClick);
    }

    return () => {
      if (toggleButton && wrapper) {
        toggleButton.removeEventListener("click", handleToggleClick);
        window.removeEventListener("click", handleWindowClick);
      }
    };
  }, [wrapperRef, toggleButtonRef]);

  return (
    <div ref={wrapperRef} className="side-bar-container shadow-md   h-full">
      <div className="side-bar-inner h-full">
        <div className="flex flex-col h-full justify-between pl-1 pr-1 pt-2 pb-2 ">
          <div className="top-sec h-full">
            <div className="top-sec-inner h-full">
              {topMenu.map((item, i) => {
                return (
                  <React.Fragment>
                    {item.iconType === "image" ? (
                      <hr className=" mt-2 mb-2" />
                    ) : null}

                    <div
                      ref={item.ref ? item.ref : null}
                      className={`${item.class}  font-normal  mt-1 text-[14px] tabs w-full  flex justify-start items-center `}
                    >
                      <div className="icon pl-2 pr-2 pt-2 pb-2 mr-2 shrink-0">
                        {item.iconType === "image" ? (
                          <img
                            className="w-[20px] h-[20px]"
                            src={item.icon}
                            alt="AI Icon"
                          />
                        ) : (
                          item.icon
                        )}
                      </div>

                      {item.text !== null ? (
                        <div className="text shrink-0">
                          <span>{item.text}</span>
                        </div>
                      ) : null}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className="bottom-sec">
            {bottomMenu.map((item, i) => {
              return (
                <React.Fragment>
                  {i === 2 ? <hr className=" mt-2 mb-2" /> : null}

                  <div
                    className={`${item.class}  font-normal  mt-1 text-[14px] tabs w-full  flex justify-start items-center `}
                  >
                    <div className="icon pl-2 pr-2 pt-2 pb-2 mr-2 shrink-0">
                      {item.iconType === "image" ? (
                        <img
                          className="w-[22px] h-[22px]"
                          src={item.icon}
                          alt="AI Icon"
                        />
                      ) : (
                        item.icon
                      )}
                    </div>

                    {item.text !== null ? (
                      <div className="text shrink-0">
                        <span>{item.text}</span>
                      </div>
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
