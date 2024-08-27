"use client";

import Details from "@/components/common/Details";
import { CalendarMonth, Mail, Payment } from "@mui/icons-material";
import React from "react";
import { useSelector } from "react-redux";

const Account = () => {
  const user = useSelector((state: any) => state?.user?.data?.userDetails);

  console.log(user);

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6 shadow-sm">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        Account Details
      </h3>

      {/* <div className="flex flex-col gap-8 mt-6">
        <div className="logo flex items-center flex-col w-fit gap-1">
          <img src="/logo.png" className="max-w-40" alt="Logo" />
          <span className="text-[13px] text-custom-title-gray">
            Company Logo
          </span>
        </div>
      </div> */}

      {/* <div className="flex items-center gap-20 py-6 mt-6">
        <Details
          Icon={Mail}
          label="Account Name"
          value={"Alphaspay (PTY) LTD BridgerPay JPP"}
        />
        <Details
          Icon={Mail}
          label="Account ID"
          value={"1ee5b8b5-fc12-5dbb-9634-9bee0b3df3e5"}
        />
      </div> */}
      <h4 className="text-button font-semibold mt-12">User</h4>

      <div className="res-4-grid py-6 border-b border-light-gray">
        <Details Icon={Mail} label="ID" value={user?.user?.id} />
        <Details
          Icon={Payment}
          label="First Name"
          value={user?.user?.first_name}
        />
        <Details
          Icon={Payment}
          label="Last Name"
          value={user?.user?.last_name}
        />
        <Details Icon={Payment} label="Username" value={user?.user?.username} />
        <Details
          Icon={Payment}
          label="User Type"
          value={user?.user?.user_type}
        />
      </div>

      <h4 className="text-button font-semibold mt-6">Contact</h4>

      <div className="res-4-grid py-6 border-b border-light-gray">
        <Details Icon={CalendarMonth} label="Email" value={user?.user?.email} />
        <Details
          Icon={CalendarMonth}
          label="Phone"
          value={user?.phone_number}
        />
      </div>

      <h4 className="text-button font-semibold mt-6">Address</h4>

      <div className="res-4-grid py-6 border-light-gray">
        <Details Icon={CalendarMonth} label="Country" value={user?.country} />
        <Details Icon={CalendarMonth} label="State" value={user?.state} />
        <Details Icon={CalendarMonth} label="City" value={user?.city} />
      </div>

      <div className="flex gap-4 items-center mt-20 flex-wrap">
        <button className="border-0 py-3 text-center text-white bg-green-button rounded-medium w-56 ">
          Edit Details
        </button>
      </div>
    </div>

    // <DashboardPageWrapper>
    //   <div className="data-grid-container">
    //     <div className=" flex items-center justify-between">
    //       <h2 className="text-xl font-semibold">Account Details</h2>
    //     </div>

    //     <div className="detailspage mt-6">
    //       <div className="flex flex-col gap-4">
    //         <DetailsWrapper title={"Account Name"}>
    //           <TransparentInput value={`Alphaspay (PTY) LTD BridgerPay JPP`} />
    //         </DetailsWrapper>
    //         <DetailsWrapper title={"Account ID"}>
    //           <TransparentInput
    //             value={`1ee5b8b5-fc12-5dbb-9634-9bee0b3df3e5`}
    //           />
    //         </DetailsWrapper>
    //         <DetailsWrapper title={"Company Logo"}>
    //           <img src="/logo.png" className="max-w-40" alt="Logo" />
    //         </DetailsWrapper>

    //         <div className="flex gap-2 justify-center max-w-[75%] mt-6">
    //           <Button variant="text" className="py-2 px-8" disabled>
    //             Edit Account Name
    //           </Button>
    //           <Button variant="text" className="py-2 px-8" disabled>
    //             Edit Company Logo
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </DashboardPageWrapper>
  );
};

export default Account;
