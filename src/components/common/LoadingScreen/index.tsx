import React from "react";
import Loader from "../Loader";

const LoadingScreen = () => {
  return (
    <div className="top-0 right-0 bottom-0 left-0 z-50 absolute bg-white">
      <div className="mt-4 font-semibold text-h2 text-purple-500 text-center">
       <img src="/logo-new.png" alt="" className="block mx-auto w-64" />
      </div>
      <div className="top-2/4 left-2/4 absolute -translate-x-1/2 -translate-y-1/2">
        <Loader bg={true} />
      </div>
    </div>
  );
};

export default LoadingScreen;
