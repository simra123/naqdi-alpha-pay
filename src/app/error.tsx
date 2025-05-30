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
    console.log({ error, message: "React Error Boundry" });
  }, [error]);

  return (
    <div className="flex justify-center items-center bg-[url('/error-bg.png')] bg-no-repeat bg-left-bottom h-dvh">
      <div>
        <img
          src="/404.png"
          alt="404"
          className="mx-auto w-[580px] max-w-[90%]"
        />
        <div className="text-black-100 text-center">
          <p className="mt-16 font-medium text-h3">
            <span className="text-red-button"> {error.message} </span>
          </p>
          <p className="mt-4 font-medium text-p122">Something went wrong</p>
          <div className="mx-auto mt-12 w-[310px]">
            <LoaderButton
              content={"Go to Home"}
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
