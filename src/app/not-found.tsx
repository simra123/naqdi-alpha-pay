"use client";
import React from "react";
import LoaderButton from "@/components/common/LoaderButton";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="p-10 bg-[#FAFAFA] h-dvh">
      <div className="bg-white shadow-sm h-full p-6 md:p-16">
        <img
          src="/404.png"
          alt="404"
          className="max-w-[90%] w-[667px] mx-auto"
        />
        <div className="text-center text-black-100">
          <p className="font-medium text-h3 mt-16">Oops! Page not Found</p>
          <p className="font-medium text-p122 mt-4">
            Remote developers with strong technical and communication skills at
            unbeatable prices, ready to work in your timezone.
          </p>
          <div className="mx-auto w-[310px] mt-12">
            <LoaderButton
              content={"Go Back"}
              variant="contained"
              onClick={() => router.replace("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
