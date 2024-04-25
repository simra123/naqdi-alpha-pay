import React, { FC, ReactNode } from "react";

interface Props {
  heading?: string;
  error?: string | boolean;
  children: ReactNode;
  childWrapperClass?: string;
}

const FormSection: FC<Props> = ({
  heading,
  error,
  children,
  childWrapperClass,
}) => {
  return (
    <div className={`mb-8 `}>
      <h5 className="mb-[8px]">{heading}</h5>
      <div className={childWrapperClass}>{children}</div>
      {error && <div className="error_text">{error}</div>}
    </div>
  );
};

export default FormSection;
