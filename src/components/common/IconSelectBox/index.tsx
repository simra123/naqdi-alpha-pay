import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdClose,
  MdInfo,
} from "react-icons/md";

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
  clearable?: boolean;
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
  clearable,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const optionsContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (open && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, searchable]);

  const toggleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setOpen((prev) => {
      return !prev;
    });
  };

  const handleSelect = (optionValue: OptionType) => {
    searchable && setSearchQuery(optionValue.label || optionValue.value);
    searchable && setSelectedValue(optionValue.label || optionValue.value);
    onChange({ target: { value: optionValue.value, name: name } });
    setOpen(false);
  };

  const filteredOptions = useMemo(() => {
    return searchable
      ? options.filter((option) =>
          String(option?.label || "")
            .toLowerCase()
            .includes(String(searchQuery || "").toLowerCase())
        )
      : options;
  }, [searchQuery, options, searchable]);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = e.target.value;
    searchable && setSearchQuery(val);
    setHighlightedIndex(0); // reset highlight
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      const selected = filteredOptions[highlightedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchQuery("");
    setSelectedValue("");
    onChange({ target: { value: "", name } });
  };

  useEffect(() => {
    const container = optionsContainerRef.current;
    if (!container) return;

    const activeOption = container.children[highlightedIndex] as HTMLElement;
    if (activeOption) {
      activeOption.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

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
      <div className="group relative min-w-[150px]" onKeyDown={handleKeyDown}>
        {Icon && (
          <Icon className="top-0 left-4 absolute flex items-center !h-full text-gray-400" />
        )}

        {/* Conditionally show an input that allows searching if searchable is true */}
        {searchable ? (
          <input
            type="text"
            ref={inputRef}
            value={open ? searchQuery : selectedValue}
            onClick={toggleOpen}
            disabled={disabled}
            onChange={handleInputChange}
            className={`w-full min-w-0 p-4 cursor-pointer ${
              Icon ? "pl-12" : "pl-4"
            } border-[1.5px] bg-white ${inputContainerClassName} ${
              error
                ? "border-error-dark"
                : "border-light-gray focus:border-purple"
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
                : "border-light-gray focus:border-purple"
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
            className="hover:bg-light-gray p-1 rounded-full h-2-w-2 text-black-60 text-xl"
          >
            {open ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </div>
        </div>

        {clearable && selectedValue && (
          <div className="hidden top-0 right-10 absolute group-hover:flex items-center h-full text-gray-400 cursor-pointer">
            <div
              onClick={handleClear}
              className="bg-light-gray-20 hover:bg-light-gray p-1 rounded-full h-2-w-2 text-black-100 text-xl"
            >
              <MdClose />
            </div>
          </div>
        )}
        {open && (
          <div
            ref={optionsContainerRef}
            className={`z-10 absolute bg-white shadow-lg mt-1 p-3 border border-light-gray rounded-large w-full max-h-80 overflow-auto ${optionsClassName}`}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`p-3 cursor-pointer ${
                    index === 0
                      ? "rounded-t-md"
                      : index === options.length - 1
                      ? "rounded-b-md"
                      : ""
                  } ${
                    index === highlightedIndex && searchable
                      ? "bg-purple-500 text-white font-semibold"
                      : value === option.value
                      ? "bg-purple-light-purple text-purple-500 font-medium"
                      : "hover:bg-purple-light-purple hover:text-black-100"
                  }`}
                >
                  {option.label || option.value}
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
