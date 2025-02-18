import React, { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/Modals/Modal";
import ListSorting from "./ListSorting";
import ColumnFiltering from "./ColumnFiltering";
import LoaderButton from "@/components/common/LoaderButton";
import { formatFilterDataFromGroups, updateMetaItemInGroup } from "../../utils";

type Props = {
  filterOpen: boolean;
  setFilterOpen: any;
  listConfig: any;
  filterData: any;
  sortData: any;
  setColumns: any;
  columns: any;
  onFiltersApply: (date: any) => void;
  onViewsApply: (date: any) => void;
};

type FilterType = FilterTypesEnum.Filter | FilterTypesEnum.Sorting;

enum FilterTypesEnum {
  Sorting = "sorting",
  Filter = "columns_filters",
}

const AdvancedTableFilters = ({
  filterOpen,
  setFilterOpen,
  listConfig,
  filterData,
  sortData,
  columns,
  setColumns,
  onFiltersApply,
  onViewsApply,
}: Props) => {
  const [filterType, setFilterType] = useState<FilterType>(
    FilterTypesEnum.Filter
  );
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
      color: "#6D2BE1",
    },
  ]);
  const [groups, setGroups] = useState([]);
  const [listViews, setListViews] = useState([]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  const ApplyHandler = () => {
    if (filterType == FilterTypesEnum.Filter) {
      const updatedGroupWithDate = updateMetaItemInGroup(
        groups,
        ["created_at"],
        {
          listColumnMeta: { name: "created_at" },
          operator: "BETWEEN",
          values: [dateRange[0].startDate, dateRange[0].endDate],
          isSelected:
            dateRange[0].startDate && dateRange[0].endDate ? true : false,
        }
      );
      setGroups(updatedGroupWithDate);
      const filteredColumnsData =
        formatFilterDataFromGroups(updatedGroupWithDate);
      console.log({ updatedGroupWithDate });

      onFiltersApply(filteredColumnsData);
    } else {
      const columns = listViews[0]?.meta?.filter((item) => item?.isSelected);
      onViewsApply(columns);
    }
  };

  return (
    <Modal
      isOpen={filterOpen}
      onClose={() => setFilterOpen(false)}
      className="!w-[1200px] !p-0"
    >
      <div className="heading pr-12 py-6 max-w-[calc(100%-48px)] border-b ml-auto">
        <h4 className="font-semibold text-p120 border-r inline-block pr-8">
          {filterType == FilterTypesEnum.Filter
            ? "Advanced Filter"
            : "List Layout"}
        </h4>
      </div>
      <div className="absolute -left-16 top-7 flex flex-col items-end">
        <button
          className={clsx(
            `min-h-[103px] font-semibold rounded-l-2xl flex items-center justify-center`,
            {
              "w-16 bg-white": filterType == FilterTypesEnum.Filter,
              "w-14 bg-disabled-white": filterType == FilterTypesEnum.Sorting,
            }
          )}
          onClick={() => handleFilterChange(FilterTypesEnum.Filter)}
        >
          Filter
        </button>
        <button
          className={clsx(
            `min-h-[103px] font-semibold rounded-l-2xl flex items-center justify-center`,
            {
              "w-16 bg-white": filterType == FilterTypesEnum.Sorting,
              "w-14 bg-disabled-white": filterType == FilterTypesEnum.Filter,
            }
          )}
          onClick={() => handleFilterChange(FilterTypesEnum.Sorting)}
        >
          List
        </button>
      </div>

      <div className="max-h-[calc(100vh-300px)] min-h-[60vh] overflow-y-auto overflow-x-hidden px-12 py-6">
        {filterType == FilterTypesEnum.Filter && (
          <ColumnFiltering
            listConfig={listConfig}
            filterData={filterData}
            groups={groups}
            setGroups={setGroups}
            onFiltersApply={onFiltersApply}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        )}
        {filterType == FilterTypesEnum.Sorting && (
          <ListSorting
            listConfig={listConfig}
            sortData={sortData}
            listViews={listViews}
            setColumns={setColumns}
            columns={columns}
            setListViews={setListViews}
          />
        )}
      </div>
      <div className="footer flex items-center justify-center gap-6 border-t-2 py-5 border-dashed">
        <button
          className="bg-blackGrey-30 w-28 rounded-[10px] py-[10px]"
          onClick={() => setFilterOpen(false)}
        >
          Cancel
        </button>
        <div className="w-28">
          <LoaderButton
            content={"Apply"}
            variant="contained"
            className="!text-base !py-[10px]"
            onClick={ApplyHandler}
          />
        </div>
        {/* <span className="text-grey-100">or</span>
        <div className="w-28">
          <LoaderButton
            content={"Save to Filter"}
            variant="text"
            className="!text-base !py-[10px] hover:bg-gray-100 rounded-[10px]"
          />
        </div> */}
      </div>
    </Modal>
  );
};

export default AdvancedTableFilters;
