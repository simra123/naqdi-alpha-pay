import React from "react";
import { TextField } from "@mui/material";
import { Bitcoin, Dollar } from "@/assets/Svgs";
const Trade = () => {
  return (
    <div className="container-custom mx-auto mt-24">
      <div className="text-center max-w-80 mx-auto">
        <h2 className="large_heading_bold mb-16">Select a Market</h2>
        <TextField
          type="text"
          className="input-field "
          fullWidth
          placeholder="Search a fiat or crypto"
        />
        <div className="flex gap-3 mt-1 justify-center">
          <button className="capsule_btn border rounded-full py-1 px-4">
            Digital
          </button>
          <button className="capsule_btn border  rounded-full py-1 px-4">
            Fiat
          </button>
          <button className="capsule_btn border  rounded-full py-1 px-4 active">
            All
          </button>
        </div>
      </div>

      <div className="currncies_list_wrapper">
        <div className="currency_section">
          <h3 className="font-semibold text-base">U.S. DOLLAR (USD)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="currency_item">
              <div className="flex">
                <div className="icons flex">
                  <Bitcoin />
                  <Dollar />
                </div>
                <span className="currency_label">BTC/USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
