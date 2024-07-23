import { Button, CircularProgress } from "@mui/material";
import React from "react";

interface Props {
  loading: boolean;
  onClick: () => void;
  variant?: any;
  content: any;
}

const LoaderButton = ({
  loading,
  onClick,
  variant = "outlined",
  content,
}: Props) => {
  return (
    <Button variant={variant} color="primary" className="py-2 px-8" onClick={onClick}>
      {loading ? <CircularProgress size={20} /> : content}
    </Button>
  );
};

export default LoaderButton;
