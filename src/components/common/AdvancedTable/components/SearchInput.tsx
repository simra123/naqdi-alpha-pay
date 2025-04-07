import React from "react";

interface SearchInputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
  onKeyDown,
  value,
}) => (
  <input
    type="text"
    value={value}
    placeholder={placeholder}
    className="w-full p-2 border-0 outline-none focus:border-b text-sm border-purple"
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);

export default SearchInput;
