"use client"; // Error boundaries must be Client Components

import LoaderButton from "@/components/common/LoaderButton";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="p-10 bg-[#FAFAFA] h-dvh">
      <div className="bg-white shadow-sm h-full p-6 md:p-16">
        <img
          src="/404.png"
          alt="404"
          className="max-w-[90%] w-[667px] mx-auto"
        />
        <div className="text-center text-black-100">
          <p className="font-medium text-h3 mt-16">
            Oops! <span className="text-red-button"> {error.message} </span>
          </p>
          <p className="font-medium text-p122 mt-4">
            Remote developers with strong technical and communication skills at
            unbeatable prices, ready to work in your timezone.
          </p>
          <div className="mx-auto w-[310px] mt-12">
            <LoaderButton
              content={"Reset"}
              variant="contained"
              onClick={reset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
