import React from "react";

const FormRadioTable = ({ items }) => {
  return (
    <>
      <div className="grid grid-cols-4">
        {items.map((item, index) => (
          <div
            className={`border p-1 text-sm  ${
              index == 0 ? "!text-right" : "flex items-center justify-center"
            }`}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
};

export default FormRadioTable;
