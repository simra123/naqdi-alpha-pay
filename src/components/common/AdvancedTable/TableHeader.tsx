import React from "react";
import SortingArrow from "./SortingArrow";
import SearchInput from "./SearchInput";
import { TableColumns } from "@/constants/types";

interface TableHeaderProps {
  columns: TableColumns;
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSort: (field: string) => void;
  onSearch: (field: string, value: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  selectable,
  selectAll,
  onSelectAll,
  onSort,
  onSearch,
}) => (
  <thead className="bg-gray-100">
    <tr>
      {selectable && (
        <th className="sticky left-0 bg-gray-100 z-10">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={onSelectAll}
          />
        </th>
      )}
      {columns.map((column) => (
        <th
          key={column.field}
          className={`p-4 ${
            column.sticky ? "sticky left-0 bg-gray-100 z-10" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{column.headerName}</span>
            {column.type !== "number" && (
              <SortingArrow onClick={() => onSort(column.field)} />
            )}
          </div>
          {column.searchable && (
            <SearchInput
              placeholder={`Search ${column.headerName}`}
              onChange={(e) => onSearch(column.field, e.target.value)}
            />
          )}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
