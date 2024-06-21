import React from "react";

const MenuIcon = ({ size, color = "#2c3e50" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-menu-2"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke={color}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </svg>
  );
};

export default MenuIcon;
