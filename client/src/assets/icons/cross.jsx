import React from "react";

const CrossIcon = ({ size, color = "#2c3e50" }) => {
  return (
    <svg
      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-dhaba5"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      data-testid="CloseIcon"
    >
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
  );
};

export default CrossIcon;
