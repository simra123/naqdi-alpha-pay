import React from "react";
import Loader from "../Loader";

const LoadingApi = ({ loading, children }) => {
  return loading ? <Loader /> : children;
};

export default LoadingApi;
