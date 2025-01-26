import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useMemo } from "react";
import { getPaginationPages } from "../utils";
import IconButton from "../../IconButton";
import {
  Add,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import RenderRoleBased from "../../RenderRoleBased";
import { Role } from "@/constants/roles";
import LoaderButton from "../../LoaderButton";

type Props = {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number | string) => void;
  pageSize: number;
  setPageSize: any;
  createHandler: () => void;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onChangePage,
  pageSize,
  setPageSize,
  createHandler,
}: Props) => {
  const user = useLocalStorage("user");

  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, pageSize, totalPages]
  );

  return (
    <div className="flex justify-center sm:justify-between items-center mt-4 relative">
      {/* Pages Indicator */}
      <span className="text-sm text-blackGrey-50 min-w-20 font-medium hidden sm:block">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      {/* Pages Navigation */}
      <div className="relative w-full">
        <div className="flex space-x-2 w-fit mx-auto bg-white p-2 rounded-sm sm:p-0">
          <IconButton
            className={
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(1)}
            disabled={currentPage === 1}
          >
            <FirstPage />
          </IconButton>
          <IconButton
            className={
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <NavigateBefore />
          </IconButton>
          {pages.map((item) =>
            item == "..." ? (
              <span>...</span>
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
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <NavigateNext />
          </IconButton>
          <IconButton
            className={
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <LastPage />
          </IconButton>
        </div>
        {createHandler && (
          <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
            <LoaderButton
              content={<Add className="!text-h2" />}
              className="!p-1 !rounded-full !w-fit absolute -top-8 right-4  sm:hidden"
              variant="contained"
              onClick={createHandler}
            />
          </RenderRoleBased>
        )}
      </div>

      {/* Page Change Dropdown below */}

      <div className="hidden sm:block">
        <label htmlFor="page-size" className="text-sm mr-2 text-blackGrey-50">
          Page Size
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            onChangePage(1);
          }}
          className="p-1 border-b cursor-pointer outline-none"
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
            content={<Add className="!text-h2" />}
            className="!p-1 !rounded-full !w-fit absolute -top-10 right-2 hidden sm:block md:hidden"
            variant="contained"
            onClick={createHandler}
          />
        </RenderRoleBased>
      )}
    </div>
  );
};

export default TablePagination;
