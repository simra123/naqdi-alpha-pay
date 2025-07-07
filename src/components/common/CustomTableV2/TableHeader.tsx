// File: components/table/TableHeader.tsx
import React from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { TableColumns } from "@/constants/types";

interface Props {
  columns: TableColumns;
  sortConfig: any;
  onSort: (column: any) => void;
  equalColumns?: boolean;
  columnClassName?: string;
  selectable?: boolean;
  selectedRows?: any[];
  setSelectedRows?: (rows: any[]) => void;
  currentRows?: any[];
  ExpandComponent?: any;
  expandRowIDKey?: string;
}

const TableHeader = ({
  columns,
  sortConfig,
  onSort,
  equalColumns,
  columnClassName,
  selectable,
  selectedRows = [],
  setSelectedRows,
  currentRows = [],
  ExpandComponent,
  expandRowIDKey = "id",
}: Props) => {
  const columnWidth = equalColumns ? `${100 / columns.length}%` : "auto";
  const selectAll =
    selectable &&
    currentRows.length > 0 &&
    currentRows.every((row) => selectedRows.includes(row));

  const handleSelectAll = () => {
    if (!selectable || !setSelectedRows) return;
    if (selectAll) setSelectedRows([]);
    else setSelectedRows(currentRows);
  };

  return (
    <thead className="bg-table-header font-medium text-gray-700">
      <tr>
        {selectable && (
          <th className="px-6 py-3 text-left">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span className="block !static checkmark"></span>
            </label>
          </th>
        )}
        {columns?.map((column, index) => (
          <th
            key={column.field + index}
            style={{ width: "auto" }}
            className={`py-3 px-6 cursor-pointer text-left ${columnClassName}`}
            onClick={() => onSort(column)}
          >
            <div className="flex justify-between items-center">
              <span className="overflow-hidden text-ellipsis text-nowrap">
                {column.headerName}
              </span>
              {sortConfig?.key === column.field && (
                <span className="ml-2">
                  {sortConfig.direction === "ascending" ? (
                    <MdArrowUpward />
                  ) : (
                    <MdArrowDownward />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
        {ExpandComponent && <th style={{ width: "auto" }}>Expand</th>}
      </tr>
    </thead>
  );
};

export default TableHeader;
