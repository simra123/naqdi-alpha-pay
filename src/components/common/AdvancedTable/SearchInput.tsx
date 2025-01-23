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
    className="w-full mt-2 p-2 border rounded-md"
    onChange={onChange}
  />
);

export default SearchInput;
