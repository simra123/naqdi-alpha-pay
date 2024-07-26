import React from "react";

const ErrorApiText = ({
  error,
  textClass = "",
  children,
}: {
  children?: any;
  textClass?: string;
  error: any;
}) => {
  return error ? (
    <div className={"error_text !text-base my-3 font-semibold" + textClass}>
      <span className="font-bold">ERROR : </span> {error}
    </div>
  ) : (
    children
  );
};

export default ErrorApiText;
