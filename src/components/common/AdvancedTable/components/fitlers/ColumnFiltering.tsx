import Checkbox from "@/components/common/CheckBox";
import tableResponse from "@/constants/tables";
import React, { useCallback, useState } from "react";
import { determineType, filterCriteria } from "../../types";
import IconSelectBox from "@/components/common/IconSelectBox";
import FilterCheckField from "./FilterCheckField";

type Props = {};

const ColumnFiltering = (props: Props) => {
  const [groups, setGroups] = useState(
    tableResponse.listConfig.groups.map((group: any) => ({
      ...group,
      meta: group.meta.map((item: any) => ({
        ...item,
        isSelected: true,
        isSticky: false,
      })),
    }))
  );

  const handleCheckboxChange = useCallback(
    (groupId: number, itemId: number) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                meta: group.meta.map((item) =>
                  item.id === itemId
                    ? { ...item, isSelected: !item.isSelected }
                    : item
                ),
              }
            : group
        )
      );
    },
    []
  );

  return (
    <>
      {/* Left: Checkbox List */}

      <div className="flex flex-col gap-y-6 w-full">
        {groups.map((group) => (
          <div key={group.id} className="flex justify-between gap-8 w-full">
            {/* Left: Checkbox List */}
            <div className="w-full">
              <h3 className="text-caption font-semibold text-grey-100 pb-4 border-b border-light-gray">
                {group.name}
              </h3>
              <div className="flex gap-y-6 flex-wrap mt-4 w-full">
                {group.meta.map((item) => {
                  let filterType = determineType(item);
                  let filterOptions = filterCriteria[filterType];

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col w-full lg:w-1/4 items-baseline gap-2 mb-2"
                    >
                      <FilterCheckField
                        group={group}
                        handleChangeWithGroup={() =>
                          handleCheckboxChange(group.id, item.id)
                        }
                        item={item}
                      />
                      {/* <Checkbox
                        checked={item.isSelected}
                        onChange={() => handleCheckboxChange(group.id, item.id)}
                        label={item.label}
                      />
                      {item?.isSelected && (
                        <div className="w-[80%]">
                          
                        <IconSelectBox
                          options={filterOptions}
                          placeholder="Select Filter Type"
                          onChange={(value) => console.log(value)}
                          />
                          </div>
                      )} */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ColumnFiltering;
