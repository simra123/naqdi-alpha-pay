import React from "react";
import Loader from "../Loader";

const LoadingScreen = () => {
  return (
    <div className="h-screen">
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
