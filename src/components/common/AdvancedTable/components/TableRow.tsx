import React, { useEffect, useRef, useState } from "react";
import { TableColumns } from "@/constants/types";
import { MdCopyAll } from "react-icons/md";
import { ListData } from "../types";

interface TableRowProps {
  row: any;
  columns: ListData;
  selectable?: boolean;
  isSelected?: boolean;
  onRowSelection: (row: any) => void;
  onRowClick?: (row: any) => void;
  columnClassName?: string;
  index?: any;
  columnWidths: number[];
  stickyOffsets: { [key: string]: number };
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  selectable,
  isSelected,
  onRowSelection,
  columnClassName,
  onRowClick,
  index,
  columnWidths,
  stickyOffsets,
}) => {
  return (
    <tr
      key={index}
      onClick={() => onRowClick && onRowClick(row)}
      className="bg-white hover:bg-gray-50 border-b cursor-pointer"
    >
      {selectable && (
        <td className="py-4 pr-6 pl-2">
          <label className="custom-checkbox">
            <input type="checkbox" onChange={() => onRowSelection(row)} />
            <span className="block !static checkmark"></span>
          </label>
        </td>
      )}
      {columns.map((column, columnIndex) => {
        const leftOffset = columnWidths
          .slice(0, columnIndex)
          .reduce((acc, width) => acc + width, 0);

        // Function to dynamically access nested object values
        const getNestedValue = (obj: any, path: string) => {
          return path
            .split(".")
            .reduce(
              (acc, key) => (acc && acc[key] ? acc[key] : undefined),
              obj
            );
        };

        const value = getNestedValue(row, column.listColumnsMeta.name);

        return (
          <td
            key={column.id}
            style={{
              left: column.isSticky
                ? `${stickyOffsets[column.id]}px`
                : undefined,
              maxWidth: 300,
            }}
            className={`${
              column.isSticky ? "sticky bg-white z-10 bg-opacity-95" : ""
            } 
          py-4 pl-2 pr-6 font-semibold ${columnClassName} 
          text-ellipsis overflow-hidden whitespace-nowrap`}
          >
            {value ? (
              <CopyButtonColumn
                value={
                  column.dataValidator
                    ? column.dataValidator(value, row)
                    : value
                }
                copyable={column.copyable}
                link={column?.link ? column?.link(row) : null}
              />
            ) : (
              "_"
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
const CopyButtonColumn = ({
  value,
  copyable,
  link,
}: {
  value: string;
  copyable: boolean;
  link?: string | null;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 1 second
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {}
  };

  return (
    <div className="flex items-center gap-2">
      {/* Link or Plain Text */}
      {link ? (
        <a
          onClick={(event) => event.stopPropagation()}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="overflow-hidden font-semibold text-black-100 hover:text-blue-700 hover:underline text-ellipsis capitalize transition-all"
        >
          {isCopied ? "Copied" : value}
        </a>
      ) : (
        <span className="flex-grow max-w-max overflow-hidden text-ellipsis whitespace-nowrap">
          {isCopied ? "Copied" : value}
        </span>
      )}

      {/* Copy Button */}
      {copyable && (
        <button
          onClick={copyToClipboard(value)}
          className="flex justify-center items-center bg-transparent hover:bg-purple-100 active:bg-purple-200 p-1 border-0 rounded-full outline-0 min-w-8 h-8 text-[14px] hover:text-white transition-all"
        >
          <MdCopyAll className="text-[16px]" />
        </button>
      )}
    </div>
  );
};
