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
import { getSortState, sortBySequence } from "../utils";
import { ListData } from "../types";
import DateField from "../../DateField";

interface TableHeaderProps {
  columns: ListData;
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSort: (id: any) => void;
  onSearch: (column: any, event: ChangeEvent<HTMLInputElement>) => void;
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
    const sortedColumns = useCallback(() => {
      return sortBySequence(columns);
    }, [columns]);
    console.log({ sortedColumns });

    return (
      <thead className="font-medium">
        {/* Header Row */}
        <tr ref={ref} className="bg-table-header">
          {selectable && (
            <th
              className="py-3 c text-left z-10 bg-table-header"
              style={{ left: 0 }}
            >
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onSelectAll}
                />
                <span className="checkmark !static block"></span>
              </label>
            </th>
          )}
          {columns?.map((column, columnIndex) => {
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
                  <span className="text-nowrap text-ellipsis overflow-hidden">
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
          {columns?.map((column, columnIndex) => {
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
                      value=""
                      date=""
                      handleChange={(date) => console.log(date)}
                      name=""
                      className="focus:border-b border-purple"
                    />
                  ) : (
                    <SearchInput
                      placeholder={`Search ${column.listColumnsMeta.label}`}
                      onChange={(event) => onSearch(column, event)}
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
