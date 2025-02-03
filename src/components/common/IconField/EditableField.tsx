import React, { useState } from "react";
import IconField from ".";
import IconButton from "../IconButton";
import { GoPencil } from "react-icons/go";
import { CancelIcon } from "@/assets/Svgs";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

type Props = {
  onEdit?: () => void;
  onBlur?: (event: any) => void;
  onCancel?: (initailValue?: any) => void;
  onChange: (event: any) => void;
  value: any;
  disabled?: boolean;
  error?: boolean | string;
  inputClassName?: string;
  name?: string;
  type?: any;
  isEditing: boolean;
  setIsEditing: (editState: boolean) => void;
  initalValue?: any;
};

const EditableField = ({
  onEdit,
  onCancel,
  onChange,
  value,
  error,
  inputClassName,
  name,
  type,
  isEditing,
  setIsEditing,
  onBlur,
  initalValue,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div
        className="flex items-center gap-2"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => {
          setIsHovered(false);
        }}
      >
        <IconField
          wrapperClassName="!mb-0"
          onChange={onChange}
          value={value}
          disabled={!isEditing}
          onBlur={onBlur}
          inputClassName={inputClassName}
          name={name}
          type={type}
        />

        {isHovered && (
          <>
            {!isEditing && (
              <IconButton
                onClick={() => setIsEditing(true)}
                className="bg-purple-10 hover:bg-purple-200 active:bg-purple-300"
              >
                <GoPencil />
              </IconButton>
            )}
            {isEditing && (
              <>
                <IconButton
                  type="submit"
                  onClick={onEdit}
                  className="bg-green-40 hover:bg-green-200 active:bg-green-300"
                >
                  <IoMdCheckmark className="text-green-button" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsEditing(false);
                    onCancel(initalValue);
                  }}
                  className="bg-red-300 hover:bg-red-200 active:bg-red-300"
                >
                  <IoMdClose className="text-red-error-dark" />
                </IconButton>
              </>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-red-error-dark text-subtitle mt-2 ml-2">{error}</p>
      )}
    </>
  );
};

export default EditableField;
