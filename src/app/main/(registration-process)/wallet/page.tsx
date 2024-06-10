"use client";

import React, { useEffect, useState } from "react";
import "./wallet.scss";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { userDetailsApi } from "@/services/user";
import ComingSoon from "@/components/ui/ComingSoon";
import ErrorApiText from "@/components/common/ErrorApiText";
import LoadingApi from "@/components/common/LoadindApi";

const Wallet = () => {
  const [Component, setComponent] = useState(null);
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(userDetailsApi()),
      successCallBack: (response: any) => {
        if (response?.userDetails?.fees) {
          setComponent(<ComingSoon />);
        } else {
          setComponent(<WalletOptions />);
        }
      },
    });
  };

  return (
    <div className="container-custom mx-auto py-10">
      <ErrorApiText error={isUserDetailsError} />
      <LoadingApi loading={isUserDetailsLoading}>{Component}</LoadingApi>
    </div>
  );
};

export default Wallet;

const WalletOptions = () => {
  return (
    <div className="grid grid-cols-2 wallet_boxes_wrapper gap-8">
      <div className="wallet_box w-full">
        <div className="box_inner_wrapper">
          <div className="icon">
            <svg
              _ngcontent-lnb-c60=""
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ng-star-inserted"
            >
              <circle
                _ngcontent-lnb-c60=""
                cx="75"
                cy="75"
                r="66"
                stroke="currentColor"
                stroke-width="18"
              ></circle>
              <path
                _ngcontent-lnb-c60=""
                d="M75 123C102.019 123 124 101.017 124 73.9979C124 46.98 102.019 25 75 25C47.9814 25 26 46.98 26 73.9979C25.9993 101.017 47.9807 123 75 123ZM58.8638 68.7521C56.155 65.3609 54.8023 61.2679 54.8023 56.4387C54.8023 51.5489 56.3373 47.4422 59.3942 44.1253C62.4545 40.7996 66.5159 38.8898 71.5964 38.385V33.9855H78.0768V38.385C82.8248 38.9504 86.5978 40.5682 89.4128 43.2431C92.21 45.9139 94.0047 49.4917 94.7804 53.9635H83.4256C82.7246 50.4525 81.3699 48.7563 78.0768 48.2837V65.741C85.2431 67.6653 90.1261 70.1846 92.713 73.2555C95.3142 76.3409 96.6058 80.2989 96.6058 85.1288C96.6058 90.5179 94.9784 95.0516 91.7084 98.7493C88.4384 102.446 83.9034 104.74 78.0768 105.658V113.993H71.5964V105.747C66.4858 105.121 62.3318 103.228 59.1214 100.037C55.9111 96.8402 53.8731 92.3223 52.9741 86.5014H64.9239C65.3954 88.8809 65.6702 89.7336 66.9797 91.456C68.2864 93.1847 69.9991 94.2472 71.5964 95.0227V76.3127C65.7999 74.6488 61.5561 72.1295 58.8638 68.7521Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M70.7963 49.73C69.145 50.3177 67.8551 51.2817 66.8937 52.6265C65.9297 53.9752 65.457 55.4533 65.457 57.0755C65.457 58.5515 65.887 59.9255 66.7637 61.2043C67.6385 62.4645 68.9872 63.4944 70.7963 64.2709V49.73V49.73Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M82.0635 91.458C83.398 89.9115 84.06 88.0915 84.06 85.9837C84.06 84.1165 83.5001 82.4994 82.3803 81.1488C81.2754 79.7859 79.4534 78.7546 76.9111 78.0227V94.4723C79.0208 94.0126 80.7432 93.0111 82.0635 91.458Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="balance_section">
            <h5>Total Balance</h5>
            <span className="balance">__</span>
            <div className="mt-6">
              <button className="btn gradient-btn max-w-48">Open Wallet</button>
            </div>
          </div>

          <div className="wallet_data_section">
            <div className="flex">
              <div className="w-3/6">
                <h5>Available to Trade</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Locked in Orderse</h5>
                <span className="balance">__</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-3/6">
                <h5>Pending Deposits</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Pending Withdrawals</h5>
                <span className="balance">__</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wallet_box w-full">
        <div className="box_inner_wrapper">
          <div className="icon">
            <svg
              _ngcontent-lnb-c60=""
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ng-star-inserted"
            >
              <circle
                _ngcontent-lnb-c60=""
                cx="75"
                cy="75"
                r="66"
                stroke="currentColor"
                stroke-width="18"
              ></circle>
              <path
                _ngcontent-lnb-c60=""
                d="M75 123C102.019 123 124 101.017 124 73.9979C124 46.98 102.019 25 75 25C47.9814 25 26 46.98 26 73.9979C25.9993 101.017 47.9807 123 75 123ZM58.8638 68.7521C56.155 65.3609 54.8023 61.2679 54.8023 56.4387C54.8023 51.5489 56.3373 47.4422 59.3942 44.1253C62.4545 40.7996 66.5159 38.8898 71.5964 38.385V33.9855H78.0768V38.385C82.8248 38.9504 86.5978 40.5682 89.4128 43.2431C92.21 45.9139 94.0047 49.4917 94.7804 53.9635H83.4256C82.7246 50.4525 81.3699 48.7563 78.0768 48.2837V65.741C85.2431 67.6653 90.1261 70.1846 92.713 73.2555C95.3142 76.3409 96.6058 80.2989 96.6058 85.1288C96.6058 90.5179 94.9784 95.0516 91.7084 98.7493C88.4384 102.446 83.9034 104.74 78.0768 105.658V113.993H71.5964V105.747C66.4858 105.121 62.3318 103.228 59.1214 100.037C55.9111 96.8402 53.8731 92.3223 52.9741 86.5014H64.9239C65.3954 88.8809 65.6702 89.7336 66.9797 91.456C68.2864 93.1847 69.9991 94.2472 71.5964 95.0227V76.3127C65.7999 74.6488 61.5561 72.1295 58.8638 68.7521Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M70.7963 49.73C69.145 50.3177 67.8551 51.2817 66.8937 52.6265C65.9297 53.9752 65.457 55.4533 65.457 57.0755C65.457 58.5515 65.887 59.9255 66.7637 61.2043C67.6385 62.4645 68.9872 63.4944 70.7963 64.2709V49.73V49.73Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M82.0635 91.458C83.398 89.9115 84.06 88.0915 84.06 85.9837C84.06 84.1165 83.5001 82.4994 82.3803 81.1488C81.2754 79.7859 79.4534 78.7546 76.9111 78.0227V94.4723C79.0208 94.0126 80.7432 93.0111 82.0635 91.458Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="balance_section">
            <h5>Total Balance</h5>
            <span className="balance">__</span>
            <div className="mt-6">
              <button className="btn gradient-btn max-w-48">Open Wallet</button>
            </div>
          </div>

          <div className="wallet_data_section">
            <div className="flex">
              <div className="w-3/6">
                <h5>Available to Trade</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Locked in Orderse</h5>
                <span className="balance">__</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-3/6">
                <h5>Pending Deposits</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Pending Withdrawals</h5>
                <span className="balance">__</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wallet_box w-full">
        <div className="box_inner_wrapper">
          <div className="icon">
            <svg
              _ngcontent-lnb-c60=""
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ng-star-inserted"
            >
              <circle
                _ngcontent-lnb-c60=""
                cx="75"
                cy="75"
                r="66"
                stroke="currentColor"
                stroke-width="18"
              ></circle>
              <path
                _ngcontent-lnb-c60=""
                d="M75 123C102.019 123 124 101.017 124 73.9979C124 46.98 102.019 25 75 25C47.9814 25 26 46.98 26 73.9979C25.9993 101.017 47.9807 123 75 123ZM58.8638 68.7521C56.155 65.3609 54.8023 61.2679 54.8023 56.4387C54.8023 51.5489 56.3373 47.4422 59.3942 44.1253C62.4545 40.7996 66.5159 38.8898 71.5964 38.385V33.9855H78.0768V38.385C82.8248 38.9504 86.5978 40.5682 89.4128 43.2431C92.21 45.9139 94.0047 49.4917 94.7804 53.9635H83.4256C82.7246 50.4525 81.3699 48.7563 78.0768 48.2837V65.741C85.2431 67.6653 90.1261 70.1846 92.713 73.2555C95.3142 76.3409 96.6058 80.2989 96.6058 85.1288C96.6058 90.5179 94.9784 95.0516 91.7084 98.7493C88.4384 102.446 83.9034 104.74 78.0768 105.658V113.993H71.5964V105.747C66.4858 105.121 62.3318 103.228 59.1214 100.037C55.9111 96.8402 53.8731 92.3223 52.9741 86.5014H64.9239C65.3954 88.8809 65.6702 89.7336 66.9797 91.456C68.2864 93.1847 69.9991 94.2472 71.5964 95.0227V76.3127C65.7999 74.6488 61.5561 72.1295 58.8638 68.7521Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M70.7963 49.73C69.145 50.3177 67.8551 51.2817 66.8937 52.6265C65.9297 53.9752 65.457 55.4533 65.457 57.0755C65.457 58.5515 65.887 59.9255 66.7637 61.2043C67.6385 62.4645 68.9872 63.4944 70.7963 64.2709V49.73V49.73Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M82.0635 91.458C83.398 89.9115 84.06 88.0915 84.06 85.9837C84.06 84.1165 83.5001 82.4994 82.3803 81.1488C81.2754 79.7859 79.4534 78.7546 76.9111 78.0227V94.4723C79.0208 94.0126 80.7432 93.0111 82.0635 91.458Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="balance_section">
            <h5>Total Balance</h5>
            <span className="balance">__</span>
            <div className="mt-6">
              <button className="btn gradient-btn max-w-48">Open Wallet</button>
            </div>
          </div>

          <div className="wallet_data_section">
            <div className="flex">
              <div className="w-3/6">
                <h5>Available to Trade</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Locked in Orderse</h5>
                <span className="balance">__</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-3/6">
                <h5>Pending Deposits</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Pending Withdrawals</h5>
                <span className="balance">__</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wallet_box w-full">
        <div className="box_inner_wrapper">
          <div className="icon">
            <svg
              _ngcontent-lnb-c60=""
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ng-star-inserted"
            >
              <circle
                _ngcontent-lnb-c60=""
                cx="75"
                cy="75"
                r="66"
                stroke="currentColor"
                stroke-width="18"
              ></circle>
              <path
                _ngcontent-lnb-c60=""
                d="M75 123C102.019 123 124 101.017 124 73.9979C124 46.98 102.019 25 75 25C47.9814 25 26 46.98 26 73.9979C25.9993 101.017 47.9807 123 75 123ZM58.8638 68.7521C56.155 65.3609 54.8023 61.2679 54.8023 56.4387C54.8023 51.5489 56.3373 47.4422 59.3942 44.1253C62.4545 40.7996 66.5159 38.8898 71.5964 38.385V33.9855H78.0768V38.385C82.8248 38.9504 86.5978 40.5682 89.4128 43.2431C92.21 45.9139 94.0047 49.4917 94.7804 53.9635H83.4256C82.7246 50.4525 81.3699 48.7563 78.0768 48.2837V65.741C85.2431 67.6653 90.1261 70.1846 92.713 73.2555C95.3142 76.3409 96.6058 80.2989 96.6058 85.1288C96.6058 90.5179 94.9784 95.0516 91.7084 98.7493C88.4384 102.446 83.9034 104.74 78.0768 105.658V113.993H71.5964V105.747C66.4858 105.121 62.3318 103.228 59.1214 100.037C55.9111 96.8402 53.8731 92.3223 52.9741 86.5014H64.9239C65.3954 88.8809 65.6702 89.7336 66.9797 91.456C68.2864 93.1847 69.9991 94.2472 71.5964 95.0227V76.3127C65.7999 74.6488 61.5561 72.1295 58.8638 68.7521Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M70.7963 49.73C69.145 50.3177 67.8551 51.2817 66.8937 52.6265C65.9297 53.9752 65.457 55.4533 65.457 57.0755C65.457 58.5515 65.887 59.9255 66.7637 61.2043C67.6385 62.4645 68.9872 63.4944 70.7963 64.2709V49.73V49.73Z"
                fill="currentColor"
              ></path>
              <path
                _ngcontent-lnb-c60=""
                d="M82.0635 91.458C83.398 89.9115 84.06 88.0915 84.06 85.9837C84.06 84.1165 83.5001 82.4994 82.3803 81.1488C81.2754 79.7859 79.4534 78.7546 76.9111 78.0227V94.4723C79.0208 94.0126 80.7432 93.0111 82.0635 91.458Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="balance_section">
            <h5>Total Balance</h5>
            <span className="balance">__</span>
            <div className="mt-6">
              <button className="btn gradient-btn max-w-48">Open Wallet</button>
            </div>
          </div>

          <div className="wallet_data_section">
            <div className="flex">
              <div className="w-3/6">
                <h5>Available to Trade</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Locked in Orderse</h5>
                <span className="balance">__</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-3/6">
                <h5>Pending Deposits</h5>
                <span className="balance">__</span>
              </div>
              <div className="w-3/6">
                <h5>Pending Withdrawals</h5>
                <span className="balance">__</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
