import React from "react";
import Link from "next/link";

const Certification = () => {
  return (
    <>
      <h2 className="large_heading_bold">Onboarding Certification</h2>
      <p
        className="text-base font-semibold
      "
      >
        Regulation requires us to have a clear understanding of every client's
        personal details and financial position. This gives you the security
        that all transactions executed on Alphaspay have been completed with
        counterparties that have also passed our onboarding certification.
      </p>

      <div className="my-5">
        <p className="text-lg font-bold">
          Our certification process is as follows:
        </p>
        <ul className="list-disc ms-5">
          <li>
            {" "}
            Section 1 - personal details including your Proof of Address;
          </li>
          <li>
            {" "}
            Section 2 - source of your investment funds, including your Proof of
            Funds; and
          </li>
          <li>
            {" "}
            Section 3 - certification test to demonstrate your understanding of
            the risks of trading virtual assets.
          </li>
        </ul>
      </div>

      <p className="text-base font-semibold">
        The entire Certification should take no longer than 5 minutes to
        complete so please have all your supporting documentation ready.
      </p>

      <p className=" font-semibold mt-9">
        Please click the button below to begin.
      </p>
      <Link
        className="btn-secondary w-full uppercase font-bold block text-center no-radius"
        href={"/certification-individual-form"}
        target="_blank"
      >
        Onboarding certification
      </Link>

      <p className="note mt-6">
        Once you have submitted your Onboarding Certification, please click the
        'Next' button.
      </p>
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl">Next</button>
      </div>
    </>
  );
};

export default Certification;
