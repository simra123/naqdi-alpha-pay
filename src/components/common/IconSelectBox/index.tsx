import React, { useState, useRef, useEffect } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdInfo } from "react-icons/md";

interface Props {
  label?: string | any;
  placeholder?: string;
  icon?: any;
  wrapperClassName?: string;
  onChange: (value: { target: OptionType }) => void;
  name?: string;
  value?: string;
  error?: string | boolean;
  info?: string;
  inputContainerClassName?: string;
  optionsClassName?: string;
  options: { value: string; label: string }[] | any[];
  searchable?: boolean;
  disabled?: boolean;
}

interface OptionType {
  label?: string;
  name?: string;
  value: string;
}

const IconSelectBox = ({
  label,
  placeholder,
  icon: Icon,
  wrapperClassName,
  onChange,
  name,
  value,
  error,
  info,
  options,
  searchable = false, // Default to false if not provided
  inputContainerClassName,
  disabled,
  optionsClassName,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && searchable) {
      const currentOption = options?.find((item) => item?.value === value);
      if (currentOption) {
        setSearchQuery(currentOption?.label || "");
        setSelectedValue(currentOption?.label || "");
      }
    }
    if (!value && searchable) {
      setSearchQuery("");
      setSelectedValue("");
    }
  }, [value]);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: OptionType) => {
    searchable && setSearchQuery(optionValue.label || optionValue.value);
    searchable && setSelectedValue(optionValue.label || optionValue.value);
    onChange({ target: { value: optionValue.value, name: name } });
    setOpen(false);
  };

  const filteredOptions = searchable
    ? options.filter((option) => {
        const label = String(option?.label || "");
        const query = String(searchQuery || "");
        return label.toLowerCase().includes(query.toLowerCase());
      })
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        searchable && setSearchQuery(selectedValue);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    searchable && setSearchQuery(e.target.value);
    setOpen(true); // Show the dropdown when typing
  };

  return (
    <div className={`mb-4 text-input ${wrapperClassName}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="block mb-2 font-medium">{label}</label>
          {info && (
            <div className="group relative flex items-center">
              <MdInfo className="mb-1 text-[18px] text-blue-info" />
              <div className="hidden group-hover:block -top-[112px] -left-[50px] absolute bg-dark-gray py-2 rounded-large w-96 text-white text-sm transition-opacity duration-200">
                <div className="relative p-2">
                  <p className="w-full text-center">{info}</p>
                  <div className="-bottom-[38px] left-[33px] absolute bg-dark-gray rounded-large w-[50px] h-[50px] polygon-clip"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="top-0 left-4 absolute flex items-center !h-full text-gray-400" />
        )}

        {/* Conditionally show an input that allows searching if searchable is true */}
        {searchable ? (
          <input
            type="text"
            value={open ? searchQuery : selectedValue}
            onClick={toggleOpen}
            disabled={disabled}
            onChange={handleInputChange}
            className={`w-full min-w-0 p-4 cursor-pointer ${
              Icon ? "pl-12" : "pl-4"
            } border-[1.5px] bg-white ${inputContainerClassName} ${
              error
                ? "border-error-dark"
                : "border-light-gray focus:border-purple-100"
            } rounded-large focus:outline-none placeholder:text-blackGrey-placeholder`}
            placeholder={placeholder}
          />
        ) : (
          // If not searchable, display the value as a non-editable div
          <div
            onClick={toggleOpen}
            className={`w-full p-4 pr-10 cursor-pointer capitalize ${
              Icon ? "pl-12" : "pl-4"
            } border-[1.5px] bg-white ${inputContainerClassName} ${
              error
                ? "border-error-dark"
                : "border-light-gray focus:border-purple-100"
            } rounded-large focus:outline-none placeholder:text-blackGrey-placeholder`}
          >
            {value ? (
              filteredOptions?.find((item) => item?.value == value)?.label ||
              value
            ) : (
              <span className="text-blackGrey-placeholder">{placeholder}</span>
            )}
          </div>
        )}

        <div className="top-0 right-4 absolute flex items-center h-full text-gray-400 cursor-pointer">
          <div
            onClick={toggleOpen}
            className="hover:bg-light-gray p-1 rounded-full h-2-w-2"
          >
            {open ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </div>
        </div>
        {open && (
          <div
            className={`z-10 absolute bg-white shadow-lg mt-1 p-3 border border-light-gray rounded-large w-full max-h-80 overflow-auto ${optionsClassName}`}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions?.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`p-3 cursor-pointer  ${
                    index === 0
                      ? "rounded-t-md"
                      : index === options?.length - 1 && "rounded-b-md"
                  } ${
                    value === option.value
                      ? "bg-purple-light-purple text-purple-500 font-medium"
                      : "hover:bg-purple-light-purple hover:text-black-100"
                  }`}
                >
                  {option?.label || option?.value}
                </div>
              ))
            ) : (
              <div className="p-3 text-center">No results found</div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-[4px] ml-4 text-red-error-dark text-subtitle">
          {error}
        </p>
      )}
    </div>
  );
};

export default IconSelectBox;
