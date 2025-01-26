import React, { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/Modals/Modal";
import ListSorting from "./ListSorting";
import ColumnFiltering from "./ColumnFiltering";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FilterType = FilterTypesEnum.Filter | FilterTypesEnum.Sorting;

enum FilterTypesEnum {
  Sorting = "sorting",
  Filter = "columns_filters",
}

const AdvancedTableFilters = ({ isOpen, onClose }: Props) => {
  const [filterType, setFilterType] = useState<FilterType>(
    FilterTypesEnum.Filter
  );

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="!w-[1200px]">
      FiltersModal
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
      <div>
        {filterType == FilterTypesEnum.Sorting && <ListSorting />}
        {filterType == FilterTypesEnum.Filter && <ColumnFiltering />}
      </div>
    </Modal>
  );
};

export default AdvancedTableFilters;
