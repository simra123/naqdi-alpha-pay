import React, {
  ChangeEventHandler,
  FC,
  forwardRef,
  MutableRefObject,
  Ref,
  RefObject,
} from "react";

interface Props {
  name: string;
  onChange: ChangeEventHandler;
  value: any;
}

const FileHiddenButton = forwardRef(
  ({ name, onChange, value }: Props, ref?: any) => {
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
  }
);

export default FileHiddenButton;
