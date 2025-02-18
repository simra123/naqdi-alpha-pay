import React, { useState } from "react";
import LoaderButton from "../../LoaderButton";
import IconField from "../../IconField";
import { FilterIcon, SearchbarIcon } from "@/assets/Svgs";
import AdvancedTableFilters from "./fitlers";

type Props = {
  listConfig?: any;
  filtersData?: any;
  sortData?: any;
  filterOpen: boolean;
  setFilterOpen: any;
  setColumns?:any;
  columns?:any;
  onPdfExport?: () => void;
  onCsvExport?: () => void;
  onRefresh?: () => void;
  onSearch?: () => void;
  onFilterClick?: () => void;
  onFiltersApply?: (filterData: any) => void;
  onViewsApply?: (viewsData: any) => void;
};

const TableActions = ({
  filtersData,
  sortData,
  listConfig,
  filterOpen,
  setFilterOpen,
  columns,
  setColumns,
  onCsvExport,
  onFilterClick,
  onPdfExport,
  onRefresh,
  onSearch,
  onFiltersApply,
  onViewsApply,
}: Props) => {
  console.log({ listConfig });

  return (
    <div className="flex items-center justify-between mb-6">
      <AdvancedTableFilters
        listConfig={listConfig}
        filterData={filtersData}
        columns={columns}
        setColumns={setColumns}
        sortData={sortData}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        onFiltersApply={onFiltersApply}
        onViewsApply={onViewsApply}
      />
      <div className="left-actions flex items-center gap-3">
        <LoaderButton
          content={"Export PDF"}
          variant={"outlined"}
          onClick={onPdfExport}
        />

        <LoaderButton
          content={"Export CSV"}
          variant={"outlined"}
          onClick={onCsvExport}
        />
      </div>
      <div className="right-actions flex items-center gap-3">
        <IconField
          onChange={onSearch}
          value={""}
          icon={SearchbarIcon}
          wrapperClassName="!mb-0 !w-[250px] max-w-full lg:block hidden"
          inputClassName="py-3"
        />
        <button className="bg-none bg-transparent block lg:hidden outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3">
          <SearchbarIcon className="" />
        </button>

        <button
          className="bg-none bg-transparent outline-0 border rounded-xl transition-all hover:bg-gray-100 p-1 w-11 h-11 flex items-center justify-center"
          //   onClick={onFilterClick}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FilterIcon />
        </button>
      </div>
    </div>
  );
};

export default TableActions;
