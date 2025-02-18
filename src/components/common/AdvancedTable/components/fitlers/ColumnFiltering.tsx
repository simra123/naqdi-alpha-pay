import React, { useCallback, useEffect, useState } from "react";
import FilterCheckField from "./FilterCheckField";
import { formatFilterDataFromGroups, getFilterState } from "../../utils";
import SearchInput from "../SearchInput";
import { IoCloseOutline } from "react-icons/io5";
import humanize from "humanize-string";
import moment from "moment";
import IconField from "@/components/common/IconField";
import { SearchbarIcon } from "@/assets/Svgs";
import RangePicker from "./DateRangePicker";
import "../../style.scss";

type Props = {
  listConfig: any;
  filterData: any;
  groups: any;
  setGroups: any;
  onFiltersApply: (filtersData: any) => void;
  dateRange: any;
  setDateRange: any;
};

const ColumnFiltering = ({
  listConfig,
  filterData,
  groups,
  setGroups,
  dateRange,
  setDateRange,
  onFiltersApply,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (listConfig) {
      const updatedGroups = listConfig.groups.map((group) => ({
        ...group,
        meta: group.meta.map((meta) => {
          const matchedFilter = filterData.find(
            (filter) => filter.listColumnMeta.name === meta.name
          );

          if (matchedFilter) {
            return {
              ...meta,
              isSelected: true,
              ...matchedFilter,
            };
          }

          return meta;
        }),
      }));

      setGroups(updatedGroups);
    }
  }, [listConfig, filterData]);

  const handleCheckboxChange = useCallback(
    (groupId: number, itemId: number) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                meta: group.meta.map((item) => {
                  const isSelected = !item.isSelected;

                  if (item.name === "created_at" && !isSelected) {
                    setDateRange([
                      {
                        startDate: null,
                        endDate: null,
                        key: "selection",
                        color: "#6D2BE1",
                      },
                    ]);
                  }

                  return item.id === itemId
                    ? {
                        ...item,
                        isSelected,
                        listColumnMeta: { name: item.name },
                      }
                    : item;
                }),
              }
            : group
        )
      );
    },
    []
  );

  const removeFilter = (name: string) => {
    let filters = filterData.filter((item) => {
      if (item.listColumnMeta.name === "created_at") {
        setDateRange([
          {
            startDate: null,
            endDate: null,
            key: "selection",
            color: "#6D2BE1",
          },
        ]);
      }
      return item.listColumnMeta.name !== name;
    });
    onFiltersApply(filters);
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="w-[70%]">
          <IconField
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            value={searchTerm}
            icon={SearchbarIcon}
            wrapperClassName="!mb-0 lg:block hidden"
            inputClassName="py-3 rounded-md"
            placeholder="Search columns..."
          />
        </div>
        <div className="flex-1">
          <RangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-6">
        {filterData.map((filter, index) => {
          const isDate = (value: string) =>
            moment(value, "YYYY-MM-DD", true).isValid() ||
            moment(value).isValid();

          const formatValue = (value: string) =>
            isDate(value) ? moment(value).format("MM/DD/YYYY") : value;

          const displayValue =
            filter.values.length === 1 ? (
              <>
                <span className="font-semibold">
                  {humanize(filter.listColumnMeta.name)} :
                </span>{" "}
                <span>{formatValue(filter.values[0])}</span>
              </>
            ) : (
              <>
                <span className="font-semibold">
                  {humanize(filter.listColumnMeta.name)} :
                </span>{" "}
                <span>
                  {formatValue(filter.values[0])} -{" "}
                  {formatValue(filter.values[1])}
                </span>
              </>
            );

          return (
            <div
              key={index}
              className="flex items-center gap-2 p-1 pr-3 bg-white-100 border border-disabled-white rounded-large"
            >
              <button
                className="p-1 rounded-full"
                onClick={() => removeFilter(filter.listColumnMeta.name)}
              >
                <IoCloseOutline className="text-p120" />
              </button>
              <span className="text-blue-greyish text-caption">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-y-6 w-full">
        {groups?.map((group) => {
          const filteredMeta = group.meta.filter((item) =>
            item.name.toLowerCase().includes(searchTerm)
          );

          if (filteredMeta.length === 0) return null; // Hide empty groups

          return (
            <div key={group.id} className="flex justify-between gap-8 w-full">
              <div className="w-full">
                <h3 className="text-caption font-semibold text-grey-100 pb-4 border-b border-light-gray">
                  {group.name}
                </h3>
                <div className="flex gap-y-6 flex-wrap mt-4 w-full">
                  {filteredMeta.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col w-full lg:w-1/4 items-baseline gap-2 mb-2"
                    >
                      <FilterCheckField
                        group={group}
                        setGroups={setGroups}
                        handleChangeWithGroup={() =>
                          handleCheckboxChange(group.id, item.id)
                        }
                        item={item}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ColumnFiltering;
