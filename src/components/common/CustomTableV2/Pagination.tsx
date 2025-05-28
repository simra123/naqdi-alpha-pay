// File: components/table/Pagination.tsx
import React, { useMemo } from "react";
import IconButton from "../IconButton";
import LoaderButton from "../LoaderButton";
import RenderRoleBased from "../RenderRoleBased";
import {
  MdAdd,
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";

const getPaginationPages = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] => {
  if (totalPages <= 0 || currentPage < 1 || currentPage > totalPages) return [];

  const totalPageNumbers = siblingCount * 2 + 3;
  const pages: (number | string)[] = [];

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  if (leftSiblingIndex > 2) pages.push("...");

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }

  if (rightSiblingIndex < totalPages - 1) pages.push("...");
  if (!pages.includes(1)) pages.unshift(1);
  if (!pages.includes(totalPages)) pages.push(totalPages);

  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  pageSize,
  setPageSize,
  setCurrentPage,
  createHandler,
}) => {
  const user = useLocalStorage("user");
  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div className="mt-4 overflow-auto">
      <div className="flex justify-between items-center">
        <span className="block min-w-20 font-medium text-blackGrey-50 text-sm">
          {`${(currentPage - 1) * pageSize + 1} - ${Math.min(
            currentPage * pageSize,
            totalPages * pageSize
          )} of ${totalPages * pageSize}`}
        </span>

        <div className="flex items-center gap-2">
          <IconButton
            disabled={currentPage === 1}
            onClick={() => onChangePage(1)}
            className="disabled:text-gray-400"
          >
            <MdFirstPage />
          </IconButton>
          <IconButton
            disabled={currentPage === 1}
            onClick={() => onChangePage(currentPage - 1)}
            className="disabled:text-gray-400"
          >
            <MdNavigateBefore />
          </IconButton>

          {pages.map((item, index) =>
            item === "..." ? (
              <span key={index}>...</span>
            ) : (
              <IconButton
                key={index}
                className={
                  currentPage === item ? "bg-light-gray font-bold" : ""
                }
                onClick={() => onChangePage(item)}
              >
                {item}
              </IconButton>
            )
          )}

          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => onChangePage(currentPage + 1)}
            className="disabled:text-gray-400"
          >
            <MdNavigateNext />
          </IconButton>
          <IconButton
            disabled={currentPage === totalPages}
            className="disabled:text-gray-400"
            onClick={() => onChangePage(totalPages)}
          >
            <MdLastPage />
          </IconButton>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-blackGrey-50 text-sm">
            Page Size
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
            className="p-1 border-b outline-none cursor-pointer"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {createHandler && (
          <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
            <LoaderButton
              content={<MdAdd className="text-h2" />}
              className="!p-1 !rounded-full !w-fit"
              variant="contained"
              onClick={createHandler}
            />
          </RenderRoleBased>
        )}
      </div>
    </div>
  );
};

export default Pagination;
