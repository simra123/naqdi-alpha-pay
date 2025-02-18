import React, { useCallback, useEffect, useState } from "react";
import FilterCheckField from "./FilterCheckField";
import { getFilterState } from "../../utils";

type Props = { listConfig: any; filterData: any; groups: any; setGroups: any };

const ColumnFiltering = ({
  listConfig,
  filterData,
  groups,
  setGroups,
}: Props) => {
  useEffect(() => {
    console.log(
      "________________________Setting Groups___________________________"
    );
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
              ...matchedFilter, // Merge other properties from the filter state
            };
          }

          return meta;
        }),
      }));

      console.log({ updatedGroups });
      setGroups(updatedGroups);
    }
  }, [listConfig, filterData]);

  console.log({ groups });

  const handleCheckboxChange = useCallback(
    (groupId: number, itemId: number) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                meta: group.meta.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        isSelected: !item.isSelected,
                        listColumnMeta: { name: item.name },
                      }
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
                        setGroups={setGroups}
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
