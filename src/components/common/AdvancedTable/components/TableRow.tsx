import React, { useEffect, useRef, useState } from "react";
import { TableColumns } from "@/constants/types";
import { MdCopyAll } from "react-icons/md";

interface TableRowProps {
  row: any;
  columns: TableColumns;
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
  stickyOffsets
}) => {


  return (
    <tr

      key={index}
      onClick={() => onRowClick && onRowClick(row)}
      className="bg-white border-b hover:bg-gray-50 cursor-pointer"
    >
      {selectable && (
        <td className="py-4 pl-2 pr-6">
          <label className="custom-checkbox">
            <input type="checkbox" onChange={() => onRowSelection(row)} />
            <span className="checkmark !static block"></span>
          </label>
        </td>
      )}
      {columns.map((column, columnIndex) => {
        const leftOffset = columnWidths
          .slice(0, columnIndex)
          .reduce((acc, width) => acc + width, 0);

        return (
          <td
            key={column.field}
            style={{
              // left: column.sticky ? `${leftOffset}px` : undefined,
               left: column.sticky ? `${stickyOffsets[column.id]}px` : undefined,
               maxWidth: column?.maxWidth ? `${column.maxWidth}px` : undefined
            }}
            className={`${
              column.sticky ? "sticky bg-white z-10 bg-opacity-95" : ""
            } py-4 pl-2 pr-6 font-semibold ${columnClassName} text-ellipsis overflow-hidden whitespace-nowrap`}
          >
            {column.dataValidator ? (
              <CopyButtonColumn
                value={column.dataValidator(row[column.field], row)}
                copyable={column.copyable}
                link={column?.link ? column?.link(row) : null}
              />
            ) : row[column.field] ? (
              <CopyButtonColumn
                value={row[column.field]}
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
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
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
          className="hover:text-blue-700 hover:underline transition-all text-black-100 font-semibold text-ellipsis overflow-hidden capitalize"
        >
          {isCopied ? "Copied" : value}
        </a>
      ) : (
        <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap max-w-max">
          {isCopied ? "Copied" : value}
        </span>
      )}

      {/* Copy Button */}
      {copyable && (
        <button
          onClick={copyToClipboard(value)}
          className="bg-transparent flex items-center justify-center border-0 outline-0 text-[14px] hover:text-white hover:bg-purple-100 active:bg-purple-200 transition-all min-w-8 h-8 rounded-full p-1"
        >
          <MdCopyAll className="text-[16px]" />
        </button>
      )}
    </div>
  );
};
