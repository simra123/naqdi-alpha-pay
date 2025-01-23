import React, { useEffect, useRef, useState, ForwardedRef } from "react";
import { TableColumns } from "@/constants/types";
import { SortingIcon } from "@/assets/Svgs";
import SearchInput from "./SearchInput";

interface TableHeaderProps {
  columns: TableColumns;
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSort: (field: string) => void;
  onSearch: (field: string, value: string) => void;
  columnClassName?: string;
  columnWidths: number[];
  stickyOffsets: { [key: string]: number };
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
      stickyOffsets
    }: TableHeaderProps,
    ref: ForwardedRef<HTMLTableRowElement>
  ) => {
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
          {columns.map((column, columnIndex) => {
            const leftOffset = columnWidths
              .slice(0, columnIndex)
              .reduce((acc, width) => acc + width, 0);

            return (
              <th
                key={column.field}
                style={{
                  // left: column.sticky ? `${leftOffset}px` : undefined,
                  left: column.sticky ? `${stickyOffsets[column.id]}px` : undefined,
                  maxWidth: column?.maxWidth ? `${column.maxWidth}px` : undefined
                }}
                className={`py-3 pl-2 pr-6 cursor-pointer text-left ${columnClassName} text-nowrap overflow-hidden text-ellipsis ${
                  column.sticky ? "sticky bg-table-header z-10" : ""
                } `}
                onClick={() => column.sortable && onSort(column?.field)}
              >
                <div className="flex items-center">
                  <span className="text-nowrap text-ellipsis overflow-hidden">
                    {column.headerName}
                  </span>

                  <div className="ml-6">
                    <SortingIcon sortBy="des" />
                  </div>
                </div>
              </th>
            );
          })}
        </tr>

        {/* Search Input Row */}
        <tr className="border-b">
          {columns.map((column, columnIndex) => {
            const leftOffset = columnWidths
              .slice(0, columnIndex)
              .reduce((acc, width) => acc + width, 0);

            return (
              <th
                key={column.field}
                style={{
                  // left: column.sticky ? `${leftOffset}px` : undefined,
                   left: column.sticky ? `${stickyOffsets[column.id]}px` : undefined,
                   maxWidth: column?.maxWidth ? `${column.maxWidth}px` : undefined
                }}
                className={`${
                  column.sticky ? "sticky z-10 bg-table-header" : ""
                }`}
              >
                <div>
                  <SearchInput
                    placeholder={`Search ${column.headerName}`}
                    onChange={(e) => onSearch(column.field, e.target.value)}
                  />
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
