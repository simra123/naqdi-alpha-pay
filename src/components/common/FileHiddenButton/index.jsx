import React, { forwardRef } from "react";

const FileHiddenButton = forwardRef(({ name, onChange, value }, ref) => {
  return (
    <>
      <input type="file" name={name} onChange={onChange} ref={ref} hidden />
      <div className="flex gap-6 items-center">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => ref?.current?.click()}
        >
          Choose File
        </button>
        <span className="text-ellipsis max-w-[100%] text-nowrap overflow-hidden">
          {value?.name}
        </span>
      </div>
    </>
  );
});

export default FileHiddenButton;
