"use client";

import { BsChevronDown } from "react-icons/bs";
import IconSelectBox from "../IconSelectBox";
import { useEffect, useMemo, useState } from "react";
import { hasMinAccess } from "@/utils/cookies";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getMerchantFinancialSummaryAdminApi } from "@/services/admin/dashboard";
import LoadingApi from "../LoadindApi";
import ErrorApiText from "../ErrorApiText";
import { getLocalStorageValue } from "@/utils/cookies";
import { Role } from "@/constants/roles";
import { getMyFinancialSummaryApi } from "@/services/dashboard";

const columns = [
  { label: "Today’s", key: "today" },
  { label: "This Week", key: "thisWeek" },
  { label: "This Month", key: "thisMonth" },
];

interface Props {
  merchantsList?: any[];
}

export default function MerchantSummary({ merchantsList }: Props) {
  const user = getLocalStorageValue("user");
  const isAdmin = user?.role == Role.ADMIN;
  const [selctedMerchant, setSelectedMerchant] = useState(null);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [
    isAdminMerchantFinancialSummaryLoading,
    isAdminMerchantFinancialSummaryError,
    callMerchantFinancialSummaryApi,
  ] = useApi({
    initailLoading: true,
  });
  const isMerchantHasMinimumAccess = hasMinAccess(
    ModulesEnum.merchant,
    AccessLevelEnum.read
  );

  const rows = useMemo(() => {
    const baseRows = [
      { label: "Deposit", key: "deposits" },
      { label: "Withdrawal", key: "withdrawals" },
      { label: "Outstanding Balance", key: "outstandingBalance" },
    ];

    if (!isAdmin) {
      baseRows.splice(2, 0, { label: "Fee", key: "fee" }); // insert at index 2
    }

    return baseRows;
  }, [isAdmin]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedMerchant(value);
  };

  const getMerchantFinancialSummary = async () => {
    let params: { userId?: string } = {};
    if (selctedMerchant) {
      params.userId = selctedMerchant;
    }
    await callApiHook({
      apiCall: callMerchantFinancialSummaryApi(
        isAdmin
          ? getMerchantFinancialSummaryAdminApi(params)
          : getMyFinancialSummaryApi()
      ),
      successCallBack: (response: any) => {
        setFinancialSummary(response?.data);
      },
    });
  };

  useEffect(() => {
    getMerchantFinancialSummary();
  }, [selctedMerchant]);

  return (
    <div className="px-5 py-[22px] border rounded-[28px]">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 pb-4 border-b">
        <h3 className="flex-1 overflow-hidden font-nunito text-p120 2xl:text-h4 text-ellipsis whitespace-nowrap">
          {isAdmin
            ? "Merchant Deposit - Withdrawal Summary"
            : "Deposit - Withdrawal Summary"}
        </h3>
        {isAdmin && isMerchantHasMinimumAccess && (
          <div className="block w-[160px]">
            <IconSelectBox
              searchable
              placeholder="Select Merchant"
              options={merchantsList}
              clearable
              onChange={handleChange}
              wrapperClassName="!m-0"
              inputContainerClassName="!rounded-full py-3"
              optionsClassName="!right-0 !w-[240px]"
              value={selctedMerchant}
            />
          </div>
        )}
      </div>

      <LoadingApi loading={isAdminMerchantFinancialSummaryLoading}>
        {/* Grid Header */}
        <div className="gap-2 grid grid-cols-4 mt-4 mb-4 px-1">
          <div></div>
          {columns.map((col) => (
            <div
              key={col.key}
              className="w-full font-medium text-[15px] text-purple-600 text-center"
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="items-center gap-[10px] grid grid-cols-4">
              <div className="bg-purple-gradient px-4 py-[15px] rounded-xl w-full overflow-hidden font-semibold text-[15px] text-white text-center text-ellipsis whitespace-nowrap">
                {row.label}
              </div>
              {columns.map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="py-[15px] border rounded-xl overflow-hidden font-semibold text-[#1F243B] text-[15px] text-center text-ellipsis whitespace-nowrap"
                >
                  {financialSummary?.[col.key]?.[row.key]?.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) ?? "-"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </LoadingApi>
      <ErrorApiText error={isAdminMerchantFinancialSummaryError} />
    </div>
  );
}
