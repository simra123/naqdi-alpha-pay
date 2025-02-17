import React, { useCallback, useEffect, useState } from "react";
import { determineType, filterCriteria } from "../../types";
import IconSelectBox from "@/components/common/IconSelectBox";
import FilterCheckField from "./FilterCheckField";

type Props = { listConfig: any };

const ColumnFiltering = ({ listConfig }: Props) => {

  console.log({
    listConfig
  })

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (listConfig) {

      setGroups(listConfig?.groups)
    }
  }, [listConfig])

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
        {groups?.map((group) => (
          <div key={group.id} className="flex justify-between gap-8 w-full">
            {/* Left: Checkbox List */}
            <div className="w-full">
              <h3 className="text-caption font-semibold text-grey-100 pb-4 border-b border-light-gray">
                {group.name}
              </h3>
              <div className="flex gap-y-6 flex-wrap mt-4 w-full">
                {group.meta.map((item) => {

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
