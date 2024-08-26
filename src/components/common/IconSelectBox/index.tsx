// components/IconSelectBox.js
import { ArrowDropDown, ArrowDropUp, Info } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";

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
  options: { value: string; label: string }[] | any[];
  searchable?: boolean; // New prop to enable search functionality
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
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setselectedOption] = useState<OptionType>();
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const currentOption = options?.find((item) => item?.value == value);
      setselectedOption(currentOption);
    }
  }, [value]);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: OptionType) => {
    console.log(optionValue);
    setselectedOption(optionValue);
    onChange({ target: { value: optionValue.value, name: name } });
    setOpen(false);
  };

  const filteredOptions = options?.filter(
    (option) =>
      option.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option?.value?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`mb-4 text-input ${wrapperClassName}`} ref={dropdownRef}>
      <div className="flex gap-2 items-center">
        <label className="block mb-2 font-medium">{label}</label>
        {info && (
          <div className="relative flex items-center group">
            <Info className="text-blue-info mb-1 text-[18px]" />
            <div className="absolute w-96 bg-dark-gray text-white text-sm -top-[112px] rounded-large py-2 -left-[50px] hidden group-hover:block transition-opacity duration-200">
              <div className="relative p-2">
                <p className="w-full text-center">{info}</p>
                <div className="absolute polygon-clip bg-dark-gray w-[50px] h-[50px] rounded-large left-[33px] -bottom-[38px]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-0 flex h-full items-center text-gray-400" />
        )}
        <div
          onClick={toggleOpen}
          className={`w-full p-4 cursor-pointer ${
            Icon ? "pl-12" : "pl-4"
          } border-[1.5px] bg-white ${inputContainerClassName} ${
            error
              ? "border-error-dark"
              : "border-light-gray focus:border-purple-100"
          } rounded-large focus:outline-none placeholder:text-blackGrey-placeholder`}
        >
          {value || (
            <span className="text-blackGrey-placeholder">{placeholder}</span>
          )}

          <div className="absolute h-full right-4 top-0 cursor-pointer flex items-center text-gray-400">
            <div
              onClick={toggleOpen}
              className="rounded-full h-2-w-2 p-1 hover:bg-light-gray"
            >
              {open ? <ArrowDropUp /> : <ArrowDropDown />}
            </div>
          </div>
        </div>
        {open && (
          <div className="absolute w-full max-h-80 overflow-auto bg-white border p-3 border-light-gray rounded-large mt-1 shadow-lg z-10">
            {searchable && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border-b mb-2 outline-none"
                placeholder="Search..."
              />
            )}
            {filteredOptions?.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`p-3 cursor-pointer  ${
                  index == 0
                    ? "rounded-t-md"
                    : index == options?.length - 1 && "rounded-b-md"
                } ${
                  selectedOption?.value === option.value
                    ? "bg-light-purple text-purple-100 font-medium"
                    : "hover:bg-light-purple hover:text-black-100"
                }`}
              >
                {option?.label || option?.value}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-error-dark text-subtitle mt-[4px] ml-4">
          {error}
        </p>
      )}
    </div>
  );
};

export default IconSelectBox;
