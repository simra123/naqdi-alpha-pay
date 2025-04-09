import Checkbox from "@/components/common/CheckBox";
import React, { memo } from "react";
import { determineType, filterCriteria } from "../../types";
import IconSelectBox from "@/components/common/IconSelectBox";
import IconField from "@/components/common/IconField";
import DateField from "@/components/common/DateField";

type Props = {
  item?: any;
  group?: any;
  setGroups?: (updater: (prev: any) => any) => void;
  handleChangeWithGroup?: (groupId: number, itemId: number) => void;
  setDateRange: any;
};

const FilterCheckField = ({
  item,
  handleChangeWithGroup,
  group,
  setGroups,
  setDateRange,
}: Props) => {
  const columnDataType = determineType(item);
  const columnFilterOperations = filterCriteria[columnDataType];



  const handleOperatorChange = (value: string) => {
    setGroups?.((prevGroups) =>
      prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              meta: g.meta.map((m) => {
                const updatedValues = value === "BETWEEN" ? ["", ""] : [""];

                if (m.name === "created_at") {
                  setDateRange([
                    {
                      startDate: updatedValues[0],
                      endDate: updatedValues[1],
                      key: "selection",
                      color: "#6D2BE1",
                    },
                  ]);
                }

                return m.id === item.id
                  ? {
                      ...m,
                      operator: value,
                      values: updatedValues,
                    }
                  : m;
              }),
            }
          : g
      )
    );
  };

  const handleValueChange = (index: number, newValue: any) => {


    setGroups?.((prevGroups) =>
      prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              meta: g.meta.map((m) => {
                if (m.id === item.id) {
                  const updatedValues =
                    m.operator === "BETWEEN"
                      ? m.values.map((v: string, i: number) =>
                          i === index ? newValue : v
                        )
                      : [newValue];

                  // Check for "created_at" condition inside the loop
                  if (m.name === "created_at") {
                    setDateRange([
                      {
                        startDate: updatedValues[0],
                        endDate: updatedValues[1],
                        key: "selection",
                        color: "#6D2BE1",
                      },
                    ]);
                  }

                  return { ...m, values: updatedValues };
                }
                return m;
              }),
            }
          : g
      )
    );
  };

  return (
    <>
      <Checkbox
        checked={item.isSelected}
        onChange={() => handleChangeWithGroup?.(group.id, item.id)}
        label={item.label}
      />
      {item?.isSelected && (
        <>
          <div className="w-[70%]">
            <IconSelectBox
              options={columnFilterOperations}
              placeholder="Select Filter Type"
              value={item?.operator || ""}
              onChange={({ target: { value } }) => handleOperatorChange(value)}
            />
          </div>
          <div className="flex gap-2 w-[90%]">
            {item?.operator &&
              (columnDataType === "date" ? (
                <>
                  <DateField
                    value={item?.values?.[0] || ""}
                    handleChange={(date) => handleValueChange(0, date)}
                    name="date1"
                    className="bg-transparent p-4 border focus:border-purple border-light-gray rounded-large focus:outline-none placeholder:text-blackGrey-placeholder"
                    date={item?.values?.[0]}
                  />
                  {item?.operator === "BETWEEN" && (
                    <DateField
                      value={item?.values?.[1] || ""}
                      className="bg-transparent p-4 border focus:border-purple border-light-gray rounded-large focus:outline-none placeholder:text-blackGrey-placeholder"
                      handleChange={(date) => handleValueChange(1, date)}
                      name="date2"
                      date={item?.values?.[1]}
                    />
                  )}
                </>
              ) : (
                <>
                  <IconField
                    value={item?.values?.[0] || ""}
                    inputClassName="py-[10px]"
                    onChange={(event) =>
                      handleValueChange(0, event.target.value)
                    }
                    placeholder="Enter Filter Value"
                  />
                  {item?.operator === "BETWEEN" && (
                    <IconField
                      value={item?.values?.[1] || ""}
                      onChange={(event) =>
                        handleValueChange(1, event.target.value)
                      }
                      placeholder="Enter Second Value"
                    />
                  )}
                </>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default memo(FilterCheckField);
