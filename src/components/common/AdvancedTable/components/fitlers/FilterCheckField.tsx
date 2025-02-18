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
};

const FilterCheckField = ({
  item,
  handleChangeWithGroup,
  group,
  setGroups,
}: Props) => {
  const columnDataType = determineType(item);
  const columnFilterOperations = filterCriteria[columnDataType];

  console.log({ columnDataType });

  const handleOperatorChange = (value: string) => {
    setGroups?.((prevGroups) =>
      prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              meta: g.meta.map((m) =>
                m.id === item.id
                  ? {
                      ...m,
                      operator: value,
                      values: value === "BETWEEN" ? ["", ""] : [""],
                    }
                  : m
              ),
            }
          : g
      )
    );
  };

  const handleValueChange = (index: number, newValue: any) => {
    console.log({ newValue });
    setGroups?.((prevGroups) =>
      prevGroups.map((g) =>
        g.id === group.id
          ? {
              ...g,
              meta: g.meta.map((m) =>
                m.id === item.id
                  ? {
                      ...m,
                      values:
                        m.operator === "BETWEEN"
                          ? m.values.map((v: string, i: number) =>
                              i === index ? newValue : v
                            )
                          : [newValue],
                    }
                  : m
              ),
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
          <div className="w-[90%] flex gap-2">
            {item?.operator &&
              (columnDataType === "date" ? (
                <>
                  <DateField
                    value={item?.values?.[0] || ""}
                    handleChange={(date) => handleValueChange(0, date)}
                    name="date1"
                    className="border border-light-gray focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder p-4 bg-transparent"
                    date={item?.values?.[0]}
                  />
                  {item?.operator === "BETWEEN" && (
                    <DateField
                      value={item?.values?.[1] || ""}
                      className="border border-light-gray focus:border-purple rounded-large focus:outline-none  placeholder:text-blackGrey-placeholder p-4 bg-transparent"
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
