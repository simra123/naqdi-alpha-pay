import React, { useEffect, useRef, useState, ForwardedRef } from "react";
import { TableColumns } from "@/constants/types";
import { SortingIcon } from "@/assets/Svgs";

interface TableHeaderProps {
  columns: TableColumns;
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSort: (field: string) => void;
  onSearch: (field: string, value: string) => void;
  columnClassName?: string;
  columnWidths: number[];
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
    }: TableHeaderProps,
    ref: ForwardedRef<HTMLTableRowElement>
  ) => {
    return (
      <thead className="font-mediu">
        {/* Header Row */}
        <tr ref={ref} className="bg-table-header">
          {selectable && (
            <th
              className="py-3 px-4 text-left sticky left-0 z-10 bg-table-header"
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
                  left: column.sticky ? `${leftOffset}px` : undefined,
                }}
                className={`py-3 px-6 cursor-pointer text-left ${columnClassName} text-nowrap overflow-hidden text-ellipsis ${
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
        <tr>
          {selectable && (
            <th
              className="py-3 px-4 sticky left-0 z-10 bg-table-header"
              style={{ left: 0 }}
            />
          )}
          {columns.map((column, columnIndex) => {
            const leftOffset = columnWidths
              .slice(0, columnIndex)
              .reduce((acc, width) => acc + width, 0);

            return (
              <th
                key={column.field}
                style={{
                  left: column.sticky ? `${leftOffset}px` : undefined,
                }}
                className={`${
                  column.sticky ? "sticky left-0 z-10 bg-table-header" : ""
                }`}
              >
                <div>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-sm"
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
