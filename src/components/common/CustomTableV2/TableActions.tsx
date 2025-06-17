// File: components/table/TableActions.tsx
import React from "react";
import IconField from "../IconField";
import LoaderButton from "../LoaderButton";
import ErrorApiText from "../ErrorApiText";
import { MdSearch } from "react-icons/md";

const TableActions = ({
  pdf,
  csv,
  rows,
  csvLoading,
  csvError,
  isServerSide,
  searchQuery,
  setSearchQuery,
  onExportCSV,
  actions,
}) => {
  if (actions) return actions;

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="left-actions flex items-center gap-3">
        {pdf?.handler && (
          <LoaderButton
            content={"Export PDF"}
            variant={"outlined"}
            onClick={pdf.handler}
            loading={pdf.loading}
          />
        )}
        {csv && rows?.length > 0 && (
          <LoaderButton
            content={"Export CSV"}
            variant={"outlined"}
            onClick={onExportCSV}
            loading={csvLoading}
          />
        )}
      </div>

      {!isServerSide && (
        <div className="right-actions flex items-center gap-3">
          <IconField
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            icon={MdSearch}
            wrapperClassName="!mb-0 !w-[250px] max-w-full lg:block hidden"
            inputClassName="py-3"
          />
          <button className="lg:hidden block bg-transparent hover:bg-white bg-none hover:shadow-md p-3 border-0 rounded-full outline-0 w-12 h-12 transition-all">
            <MdSearch />
          </button>
        </div>
      )}

      <ErrorApiText error={csvError} />
    </div>
  );
};

export default TableActions;
