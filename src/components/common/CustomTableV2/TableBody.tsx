// File: components/table/TableBody.tsx
import React, { useState } from "react";
import Link from "next/link";
import { MdCopyAll } from "react-icons/md";
import { getNestedValue } from "./utils";

const noCapitalizeFields = ["email", "id"];

const CopyButtonColumn = ({ value, copyable, link, target, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {}
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {link ? (
        <Link
          onClick={(e) => e.stopPropagation()}
          href={link}
          target={target || "_blank"}
          className="overflow-hidden font-semibold text-black-100 hover:text-blue-700 hover:underline text-ellipsis capitalize transition-all"
        >
          {isCopied ? "Copied" : value}
        </Link>
      ) : (
        <span className="flex-grow max-w-max overflow-hidden text-ellipsis whitespace-nowrap">
          {isCopied ? "Copied" : value}
        </span>
      )}
      {copyable && (
        <button
          onClick={copyToClipboard}
          className="flex justify-center items-center bg-transparent hover:bg-purple-10 active:bg-purple-20 p-1 rounded-full w-8 h-8"
        >
          <MdCopyAll className="text-[16px]" />
        </button>
      )}
    </div>
  );
};

const TableBody = ({
  rows,
  columns,
  rowClickHandler,
  columnClassName,
  selectable,
  selectedRows = [],
  setSelectedRows,
  ExpandComponent,
  expandRowIDKey = "id",
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const handleRowSelection = (row: any) => {
    if (!selectable || !setSelectedRows) return;
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const toggleExpand = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  return (
    <tbody>
      {rows &&
        rows?.length > 0 &&
        rows?.map((row, index) => (
          <React.Fragment key={index}>
            <tr
              onClick={() => rowClickHandler && rowClickHandler(row)}
              className="bg-white hover:bg-gray-50 border-b cursor-pointer"
            >
              {selectable && (
                <td className="px-6 py-4">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleRowSelection(row)}
                    />
                    <span className="block !static checkmark"></span>
                  </label>
                </td>
              )}
              {columns?.map((column, colIndex) => {
                const value = getNestedValue(row, column.field);
                const computedValue = column.dataValidator
                  ? column.dataValidator(value, row)
                  : value;
                const shouldCapitalize = !noCapitalizeFields.some((f) =>
                  column.field.includes(f)
                );
                const link = column.link?.(row) || null;

                return (
                  <td
                    key={column.field + colIndex}
                    className={`py-4 px-6 font-semibold ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                  >
                    {computedValue ? (
                      <CopyButtonColumn
                        value={computedValue}
                        copyable={column.copyable}
                        link={link}
                        target={column.target}
                        className={shouldCapitalize ? "capitalize" : ""}
                      />
                    ) : (
                      "_"
                    )}
                  </td>
                );
              })}
              {ExpandComponent && (
                <td className={`py-4 px-6 font-semibold ${columnClassName}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(row[expandRowIDKey]);
                    }}
                    className={`px-4 py-1 rounded-md transition-all hover:bg-purple-gradient hover:text-white ${
                      expandedRows[row[expandRowIDKey]]
                        ? "text-white bg-purple-gradient"
                        : "text-purple-500 border-purple border"
                    }`}
                  >
                    {expandedRows[row[expandRowIDKey]] ? "Unexpand" : "Expand"}
                  </button>
                </td>
              )}
            </tr>
            {expandedRows[row[expandRowIDKey]] && ExpandComponent && (
              <tr className="border-b">
                <td colSpan={columns.length + 1} className="p-4">
                  <ExpandComponent row={row} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
    </tbody>
  );
};

export default TableBody;
