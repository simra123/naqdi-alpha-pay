import React from "react";
import Loader from "../Loader";

const LoadingApi = ({ loading, children }) => {
  return loading ? (
    
      <Loader bg wrapperClassName="flex justify-center" />
    
  ) : (
    children
  );
};

export default LoadingApi;
