import React from "react";
import Loader from "../Loader";

const LoadingScreen = () => {
  return (
    <div className="bg-white absolute top-0 bottom-0 left-0 right-0 z-50">
      <h2 className="text-purple-100 text-h2 text-center font-semibold mt-4">
        Alphaspay
      </h2>
      <div className="absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2">
        <Loader bg={true} />
      </div>
    </div>
  );
};

export default LoadingScreen;
