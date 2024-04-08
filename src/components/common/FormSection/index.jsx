import React from "react";

const FormSection = ({ heading, error, children, childWrapperClass }) => {
  return (
    <div className={`mb-8 `}>
      <h5 className="mb-[8px]">{heading}</h5>
      <div className={childWrapperClass}>{children}</div>
      {error && <div className="error_text">{error}</div>}
    </div>
  );
};

export default FormSection;
