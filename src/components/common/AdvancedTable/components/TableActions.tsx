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
  setColumns?: any;
  columns?: any;
  onPdfExport?: () => void;
  onCsvExport?: {
    handler?: () => void;
    loading?: boolean;
    error?: any;
  };
  onRefresh?: () => void;
  onClearFilters?: () => void;
  onFiltersApply?: (filterData: any, closeAfter?: boolean) => void;
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
  onPdfExport,
  onRefresh,
  onClearFilters,
  onFiltersApply,
  onViewsApply,
}: Props) => {


  return (
    <div className="flex justify-between items-center mb-6">
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
        {onPdfExport && (
          <LoaderButton
            content={"Export PDF"}
            variant={"outlined"}
            onClick={onPdfExport}
          />
        )}

        <LoaderButton
          content={"Export CSV"}
          variant={"outlined"}
          onClick={onCsvExport.handler}
          loading={onCsvExport.loading}
        />
      </div>
      <div className="right-actions flex items-center gap-3">
        <LoaderButton
          content={"Clear Filters"}
          variant={"outlined"}
          className="border-0"
          onClick={onClearFilters}
        />
        <button className="lg:hidden block bg-transparent hover:bg-white bg-none hover:shadow-md p-3 border-0 rounded-full outline-0 w-12 h-12 transition-all">
          <SearchbarIcon className="" />
        </button>

        <button
          className="flex justify-center items-center bg-transparent hover:bg-gray-100 bg-none p-1 border rounded-xl outline-0 w-11 h-11 transition-all"
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
