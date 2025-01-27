import Checkbox from "@/components/common/CheckBox";
import React, { useState } from "react";
import { determineType, filterCriteria } from "../../types";
import IconSelectBox from "@/components/common/IconSelectBox";
import IconField from "@/components/common/IconField";

type Props = {
  item?: any;
  group?: any;
  handleChangeWithGroup?: (groudId: number, itemId: number) => void;
};

const FilterCheckField = ({ item, handleChangeWithGroup, group }: Props) => {
  const [filterType, setFilterType] = useState("");
  const columnDataType = determineType(item);
  const columnFilterOperations = filterCriteria[columnDataType];

  return (
    <>
      <Checkbox
        checked={item.isSelected}
        onChange={() => handleChangeWithGroup(group.id, item.id)}
        label={item.label}
      />
      {item?.isSelected && (
        <div className="w-[80%]">
          <IconSelectBox
            options={columnFilterOperations}
            placeholder="Select Filter Type"
            value={filterType}
            onChange={({ target: { value } }) => setFilterType(value)}
          />
          {filterType && (
            <IconField
              onChange={(event) => console.log(event.target.value)}
              placeholder="Enter Filter Value"
            />
          )}
        </div>
      )}
    </>
  );
};

export default FilterCheckField;
