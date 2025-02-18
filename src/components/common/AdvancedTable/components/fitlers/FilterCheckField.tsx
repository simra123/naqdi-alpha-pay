import Checkbox from "@/components/common/CheckBox";
import React from "react";
import { determineType, filterCriteria } from "../../types";
import IconSelectBox from "@/components/common/IconSelectBox";
import IconField from "@/components/common/IconField";

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

  const handleValueChange = (index: number, newValue: string) => {
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
          <div className="w-[80%] flex gap-2">
            {item?.operator && (
              <>
                <IconField
                  value={item?.values?.[0] || ""}
                  onChange={(event) => handleValueChange(0, event.target.value)}
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
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FilterCheckField;
