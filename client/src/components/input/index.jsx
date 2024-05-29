const Input = ({
  type,
  label,
  placeholder,
  isRequired = true,
  containerClass,
  labelClass,
  inputClass,
  autoComplete = "true",
  value,
  onChange = () => {},
}) => {
  return (
    <div className={`mb-5 ${containerClass}`}>
      <label
        htmlFor={type}
        className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${labelClass} `}
      >
        {label}
      </label>
      <input
        type={type}
        id={type}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  ${inputClass} `}
        placeholder={placeholder}
        required={isRequired}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
