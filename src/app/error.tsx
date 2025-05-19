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
    console.log({error, message: "React Error Boundry"})
  }, [error]);

  return (
    <div className="bg-[#FAFAFA] p-10 h-dvh">
      <div className="bg-white shadow-sm p-6 md:p-16 h-full">
        <img
          src="/404.png"
          alt="404"
          className="mx-auto w-[667px] max-w-[90%]"
        />
        <div className="text-black-100 text-center">
          <p className="mt-16 font-medium text-h3">
            Oops! <span className="text-red-button"> {error.message} </span>
          </p>
          <p className="mt-4 font-medium text-p122">
            Remote developers with strong technical and communication skills at
            unbeatable prices, ready to work in your timezone.
          </p>
          <div className="mx-auto mt-12 w-[310px]">
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
