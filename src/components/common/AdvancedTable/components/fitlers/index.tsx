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
  onFiltersApply: (date: any, closeAfter?: boolean) => void;
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
      let updatedGroupWithDate = groups;

      if (dateRange[0].startDate && dateRange[0].endDate) {
        updatedGroupWithDate = updateMetaItemInGroup(groups, {
          created_at: {
            listColumnMeta: { name: "created_at" },
            operator: "BETWEEN",
            values: [dateRange[0].startDate, dateRange[0].endDate],
            isSelected: true,
          },
          createdAt: {
            listColumnMeta: { name: "createdAt" },
            operator: "BETWEEN",
            values: [dateRange[0].startDate, dateRange[0].endDate],
            isSelected: true,
          },
        });
      }

      setGroups(updatedGroupWithDate);
      const filteredColumnsData =
        formatFilterDataFromGroups(updatedGroupWithDate);

      onFiltersApply(filteredColumnsData, true);
    } else {
      const columns = listViews[0]?.meta?.filter((item) => item?.isSelected);
      onViewsApply(columns);
    }
  };

  return (
    <Modal
      isOpen={filterOpen}
      onClose={() => setFilterOpen(false)}
      className="!p-0 !w-[1200px]"
    >
      <div className="ml-auto py-6 pr-12 border-b max-w-[calc(100%-48px)] heading">
        <h4 className="inline-block pr-8 border-r font-semibold text-p120">
          {filterType == FilterTypesEnum.Filter
            ? "Advanced Filter"
            : "List Layout"}
        </h4>
      </div>
      <div className="top-7 -left-16 absolute flex flex-col items-end">
        <button
          className={clsx(
            `flex justify-center items-center rounded-l-2xl min-h-[103px] font-semibold`,
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
            `flex justify-center items-center rounded-l-2xl min-h-[103px] font-semibold`,
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

      <div className="px-12 py-6 min-h-[60vh] max-h-[calc(100vh-300px)] overflow-x-hidden overflow-y-auto">
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
      <div className="flex justify-center items-center gap-6 py-5 border-t-2 border-dashed footer">
        <button
          className="bg-blackGrey-30 py-[10px] rounded-[10px] w-28"
          onClick={() => setFilterOpen(false)}
        >
          Cancel
        </button>
        <div className="w-28">
          <LoaderButton
            content={"Apply"}
            variant="contained"
            className="!py-[10px] !text-base"
            onClick={ApplyHandler}
          />
        </div>
        {/* <span className="text-grey-100">or</span>
        <div className="w-28">
          <LoaderButton
            content={"Save to Filter"}
            variant="text"
            className="hover:bg-gray-100 !py-[10px] rounded-[10px] !text-base"
          />
        </div> */}
      </div>
    </Modal>
  );
};

export default AdvancedTableFilters;
