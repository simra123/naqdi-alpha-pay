import React from "react";
import Loader from "../Loader";

const LoadingApi = ({ loading, children }) => {
  return loading ? <Loader bg /> : children;
};

export default LoadingApi;
