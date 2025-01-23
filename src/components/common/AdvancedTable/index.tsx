import React, { useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { TableColumns } from "@/constants/types"; 

const Table= ({
  columns,
  rows,
  selectable,
  onSort,
  onSearch,
}) => {
  const [currentRows, setCurrentRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  useEffect(() => {
    setCurrentRows(rows);
  }, [rows]);

  const handleRowSelection = (row: any) => {
    const updatedSelection = selectedRows.includes(row)
      ? selectedRows.filter((r) => r !== row)
      : [...selectedRows, row];
    setSelectedRows(updatedSelection);
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === currentRows.length ? [] : [...currentRows]
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        {/* Render Table Header */}
        <TableHeader
          columns={columns}
          selectable={selectable}
          selectAll={selectable && selectedRows.length === currentRows.length}
          onSelectAll={handleSelectAll}
          onSort={onSort}
          onSearch={onSearch}
        />

        {/* Render Table Rows */}
        <tbody>
          {currentRows.map((row, index) => (
            <TableRow
              key={index}
              row={row}
              columns={columns}
              selectable={selectable}
              isSelected={selectedRows.includes(row)}
              onRowSelection={handleRowSelection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
