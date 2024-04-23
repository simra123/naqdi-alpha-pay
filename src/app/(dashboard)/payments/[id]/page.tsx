"use client";

import TransparentInput from "@/components/common/TransparentInput";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import { Button } from "@mui/material";
import React from "react";
import {
  converstion_table_columns,
  relatedPayments_table_columns,
  relatedTransactions_table_columns,
  webhooks_table_columns,
} from "../columns";
import { DataGrid } from "@mui/x-data-grid";

const PaymentDetails = ({ params }) => {
  return (
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
          <div className="actions flex gap-5">
            <Button variant="text" color="primary" disabled>
              Cancel
            </Button>
            <Button variant="text" color="primary" disabled>
              Convert
            </Button>
            <Button variant="text" color="primary" disabled>
              Re-Evaluate
            </Button>
            <Button variant="text" color="primary" disabled>
              Return Unprocessed Crypto
            </Button>
          </div>
        </div>
        <div className="detailspage mt-6">
          <div className="flex flex-col gap-4">
            <DetailsWrapper title={"Date"} align>
              <TransparentInput
                label={`Created At`}
                value={`11 Feb 2024, 19:13:19`}
              />

              <TransparentInput
                label={`Updated At`}
                value={`11 Feb 2024, 19:13:19`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"ID"} align>
              <TransparentInput
                label={`ID`}
                value={`75a6dce8-56a6-4afa-a1bc-b345b1a74f80
                `}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"ETH Address"}>
              <TransparentInput
                value={`0xEC56E02e6aDd6E2E7e6Ce054b00256F3aB6C…`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"BSC Address"}>
              <TransparentInput
                value={`0xEC56E02e6aDd6E2E7e6Ce054b00256F3aB6C…`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"TRX Address"}>
              <TransparentInput
                value={`0xEC56E02e6aDd6E2E7e6Ce054b00256F3aB6C…`}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Requested"} algin>
              <TransparentInput value={`1 USD`} label={"Requested Amount"} />
              <TransparentInput value={`_`} label={"Markup Amount"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Gross Requested Amount"}>
              <TransparentInput value={`1 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Payment Fee Amount"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Payment"} algin>
              <TransparentInput value={`1.0001 USD`} label={"Payment Amount"} />
              <TransparentInput
                value={`0 USDT`}
                label={"Payment Amount Received"}
              />
            </DetailsWrapper>
            <DetailsWrapper title={"Requested Amount Remaining"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Unprocessed Crypto Amount"}>
              <TransparentInput value={`0.01 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Net Amount Credited"}>
              <TransparentInput value={`0 USD`} />
            </DetailsWrapper>
            <DetailsWrapper title={"Status"} algin>
              <TransparentInput value={`Unpaid`} label={"Paid Status"} />
              <TransparentInput value={`New`} label={"Payment Status"} />
            </DetailsWrapper>
            <DetailsWrapper title={"Configuration"} algin>
              <TransparentInput value={`Alphaspay`} label={"Profile"} />
              <TransparentInput value={`service-alpha`} label={"User"} />
            </DetailsWrapper>

            <DetailsWrapper title={"Notes"}>
              <TransparentInput value={`Hellow`} textarea />
            </DetailsWrapper>
            <DetailsWrapper title={"Pass Through"}>
              <TransparentInput value={`_`} textarea />
            </DetailsWrapper>

            {/* TABLES BELOW */}

            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Conversions</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={converstion_table_columns}
                className="font-semibold primary-color border-t-0"
                hideFooter
                autoHeight
              />
            </div>

            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Related Transactions</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={relatedTransactions_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div>
            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Related Payments</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={relatedPayments_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div>

            <div className="data-grid-container">
              <div className="tableheader  border border-b-0 py-6 px-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Webhooks</h2>
              </div>

              <DataGrid
                rows={[]}
                columns={webhooks_table_columns}
                className="font-semibold primary-color  border-t-0"
                hideFooter
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

export default PaymentDetails;
