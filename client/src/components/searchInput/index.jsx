import React from "react";

const InputSearch = ({
  icon,
  wrapperClass,
  iconClass,
  inputClass,
  placeholder,
  type,
  isRequired,
  autoComplete,
  value,
  readOnly,
  onChange = () => {},
}) => {
  return (
    <div
      style={{ borderColor: "#eaeaea", borderBottomColor: "#d5d5d5" }}
      className={`${wrapperClass} hover:bg-[#fcfcfc] border  flex w-[98%] justify-start items-center rounded pl-2 pr-2 pt-1 pb-1 `}
    >
      {icon ? (
        <>
          <span className={`${iconClass} mr-2`}>{icon}</span>
        </>
      ) : null}
      <input
        className={`${inputClass} bg-transparent w-full text-[14px] outline-none placeholder:text-[#3b4a54]`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default InputSearch;
