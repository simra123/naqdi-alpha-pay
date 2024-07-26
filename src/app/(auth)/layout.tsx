import React from "react";

const Authlayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="flex w-full overflow-hidden shadow-lg">
        {/* Left Side (Form) */}
        <div className="w-full md:w-1/2 pt-20 px-6 bg-bluish-gray">
          <section className="content max-w-[500px] m-auto">{children}</section>
        </div>

        {/* Right Side (Image) */}

        <div className="fixed-background-wrapper">
          <div className="fixed bg-auth-bg-purple h-screen w-full md:w-1/2  flex items-center justify-center">
            <img
              src={"/auth-bg-person.png"}
              alt="Crypto Image"
              className="relative z-10 max-h-[674px]"
              draggable={false}
            />
            <img
              src="/auth-bg-footer.png"
              alt="background footer"
              className="absolute z-0 bottom-0 left-0 w-full"
              draggable={false}
            />
          </div>
          {/* Add any overlay text or icons here */}
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
