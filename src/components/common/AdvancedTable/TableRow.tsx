import React from "react";
import { TableColumns } from "@/constants/types";

interface TableRowProps {
  row: any;
  columns: TableColumns;
  selectable?: boolean;
  isSelected?: boolean;
  onRowSelection: (row: any) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  selectable,
  isSelected,
  onRowSelection,
}) => (
  <tr className="hover:bg-gray-50">
    {selectable && (
      <td className="sticky left-0 bg-white z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onRowSelection(row)}
        />
      </td>
    )}
    {columns.map((column) => (
      <td
        key={column.field}
        className={`p-4 ${column.sticky ? "sticky left-0 bg-white z-10" : ""}`}
      >
        {column.dataValidator
          ? column.dataValidator(row[column.field])
          : row[column.field]}
      </td>
    ))}
  </tr>
);

export default TableRow;
