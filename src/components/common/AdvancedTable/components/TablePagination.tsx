import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useMemo } from "react";
import { getPaginationPages } from "../utils";
import IconButton from "../../IconButton";

import RenderRoleBased from "../../RenderRoleBased";
import { Role } from "@/constants/roles";
import LoaderButton from "../../LoaderButton";
import { MdAdd, MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

type Props = {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number | string) => void;
  limit: number;
  onLimitChange: any;
  createHandler: () => void;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onChangePage,
  limit,
  onLimitChange,
  createHandler,
}: Props) => {
  const user = useLocalStorage("user");

  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, limit, totalPages]
  );


 


  return (
    <div className="relative flex justify-center sm:justify-between items-center mt-4">
      {/* Pages Indicator */}
      <span className="hidden sm:block min-w-20 font-medium text-blackGrey-50 text-sm">{`${
        (currentPage - 1) * limit + 1
      } - ${currentPage * limit} of ${totalPages * limit}`}</span>

      {/* Pages Navigation */}
      <div className="relative w-full">
        <div className="flex space-x-2 bg-white mx-auto p-2 sm:p-0 rounded-sm w-fit">
          <IconButton
            className={
              currentPage === 1 || totalPages == 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(1)}
            disabled={currentPage === 1 || totalPages == 0}
          >
            <MdFirstPage />
          </IconButton>
          <IconButton
            className={
              currentPage === 1 || totalPages == 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage === 1 || totalPages == 0}
          >
            <MdNavigateBefore />
          </IconButton>
          {pages.map((item) =>
            item == "..." ? (
              <span key={item}>...</span>
            ) : (
              <IconButton
                key={item}
                className={
                  currentPage === item &&
                  "text-black-100 font-bold bg-light-gray"
                }
                onClick={() => onChangePage(item)}
              >
                {item}
              </IconButton>
            )
          )}
          <IconButton
            className={
              currentPage === totalPages || totalPages == 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages == 0}
          >
            <MdNavigateNext />
          </IconButton>
          <IconButton
            className={
              currentPage === totalPages || totalPages == 0
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(totalPages)}
            disabled={currentPage === totalPages || totalPages == 0}
          >
            <MdLastPage />
          </IconButton>
        </div>
        {createHandler && (
          <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
            <LoaderButton
              content={<MdAdd className="!text-h2" />}
              className="sm:hidden -top-8 right-4 absolute !p-1 !rounded-full !w-fit"
              variant="contained"
              onClick={createHandler}
            />
          </RenderRoleBased>
        )}
      </div>

      {/* Page Change Dropdown below */}

      <div className="hidden sm:block">
        <label htmlFor="page-size" className="mr-2 text-blackGrey-50 text-sm">
          Page Size
        </label>
        <select
          id="page-size"
          value={limit}
          onChange={(e) => {
            onLimitChange(parseInt(e.target.value));
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
            content={<MdAdd className="!text-h2" />}
            className="hidden md:hidden sm:block -top-10 right-2 absolute !p-1 !rounded-full !w-fit"
            variant="contained"
            onClick={createHandler}
          />
        </RenderRoleBased>
      )}
    </div>
  );
};

export default TablePagination;
