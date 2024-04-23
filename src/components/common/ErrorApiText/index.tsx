import React from "react";

const ErrorApiText = ({ error, textClass = "" }) => {
  return (
    error && (
      <div className={"error_text !text-base font-semibold" + textClass}>
        <span className="font-bold">ERROR : </span> {error}
      </div>
    )
  );
};

export default ErrorApiText;
