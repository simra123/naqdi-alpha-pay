import React from "react";

interface SearchInputProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
}) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full p-2 border-0 outline-none focus:border-b text-sm border-purple"
    onChange={onChange}
  />
);

export default SearchInput;
