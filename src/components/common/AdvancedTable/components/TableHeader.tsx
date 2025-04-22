import React, {
  useEffect,
  useRef,
  useState,
  ForwardedRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { TableColumns } from "@/constants/types";
import { SortingIcon } from "@/assets/Svgs";
import SearchInput from "./SearchInput";
import { getFilterState, getSortState, sortBySequence } from "../utils";
import { ListData } from "../types";
import DateField from "../../DateField";

interface TableHeaderProps {
  columns: ListData;
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSort: (id: any) => void;
  onSearch: (column: any, event: ChangeEvent<HTMLInputElement> | any) => void;
  columnClassName?: string;
  columnWidths: number[];
  stickyOffsets: { [key: string]: number };
  sortData: any[];
  filtersData: any[];
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const TableHeader = React.forwardRef(
  (
    {
      columns,
      selectable,
      selectAll,
      onSelectAll,
      onSort,
      onSearch,
      columnClassName,
      columnWidths,
      stickyOffsets,
      sortData,
      filtersData,
      onSearchKeyDown,
    }: TableHeaderProps,
    ref: ForwardedRef<HTMLTableRowElement>
  ) => {
    const sortedColumns = sortBySequence(columns || []);


    return (
      <thead className="font-medium">
        {/* Header Row */}
        <tr ref={ref} className="bg-table-header">
          {selectable && (
            <th
              className="bg-table-header z-10 py-3 text-left c"
              style={{ left: 0 }}
            >
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onSelectAll}
                />
                <span className="block !static checkmark"></span>
              </label>
            </th>
          )}
          {sortedColumns?.map((column, columnIndex) => {
            // const leftOffset = columnWidths
            //   .slice(0, columnIndex)
            //   .reduce((acc, width) => acc + width, 0);

            return (
              <th
                key={column.id}
                style={{
                  left: column.isSticky
                    ? `${stickyOffsets[column.id]}px`
                    : undefined,
                  maxWidth: 300,
                }}
                className={`py-3 pl-2 pr-6 cursor-pointer text-left ${columnClassName} text-nowrap overflow-hidden text-ellipsis ${
                  column.isSticky ? "sticky bg-table-header z-10" : ""
                } `}
                onClick={() =>
                  column.listColumnsMeta.isSortable && onSort(column)
                }
              >
                <div className="flex items-center">
                  <span className="overflow-hidden text-ellipsis text-nowrap">
                    {column.listColumnsMeta.label}
                  </span>

                  <div className="ml-6">
                    <SortingIcon
                      sortBy={
                        getSortState(column.listColumnsMeta.name, sortData) ||
                        "ASC"
                      }
                    />
                  </div>
                </div>
              </th>
            );
          })}
        </tr>

        {/* Search Input Row */}
        <tr className="border-b">
          {sortedColumns?.map((column, columnIndex) => {
            // const leftOffset = columnWidths
            //   .slice(0, columnIndex)
            //   .reduce((acc, width) => acc + width, 0);

            return (
              <th
                key={column.id}
                style={{
                  left: column.isSticky
                    ? `${stickyOffsets[column.id]}px`
                    : undefined,
                  maxWidth: 300,
                }}
                className={`${
                  column.isSticky ? "sticky z-10 bg-table-header" : ""
                }`}
              >
                <div>
                  {column.listColumnsMeta.type == "DATE" ? (
                    <DateField
                      value={
                        getFilterState(column.listColumnsMeta.name, filtersData)
                          ?.values[0]
                      }
                      date={
                        getFilterState(column.listColumnsMeta.name, filtersData)
                          ?.values[0]
                      }
                      handleChange={(date) =>
                        onSearch(column, {
                          target: { value: date, type: "date" },
                        })
                      }
                      name={column.listColumnsMeta.name}
                      className="border-purple focus:border-b"
                    />
                  ) : (
                    <SearchInput
                      placeholder={`Search ${column.listColumnsMeta.label}`}
                      onChange={(event) => onSearch(column, event)}
                      value={
                        getFilterState(column.listColumnsMeta.name, filtersData)
                          ?.values[0] || ""
                      }
                      onKeyDown={onSearchKeyDown}
                    />
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default TableHeader;
