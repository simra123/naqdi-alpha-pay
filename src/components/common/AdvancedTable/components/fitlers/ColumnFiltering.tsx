import tableResponse from "@/constants/tables";
import React, { useCallback, useState } from "react";

type Props = {};

const ColumnFiltering = (props: Props) => {
  const [items, setItems] = useState(
    tableResponse.listConfig.groups[0].meta.map((item: any) => ({
      ...item,
      isSelected: false,
      isSticky: false,
    }))
  );

  const handleCheckboxChange = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  }, []);

  return (
    <div className="flex gap-8">
      {/* Left: Checkbox List */}
      <div>
        <h3 className="text-lg font-bold mb-4">General</h3>
        <div className="flex flex-wrap gap-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 items-start mb-2 w-full xs:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <div className="flex gap-3 items-baseline">
                <input
                  type="checkbox"
                  name={item?.name || item?.id}
                  checked={item.isSelected}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <span>{item.label}</span>
              </div>
              <div>
                {item.isSelected &&
                  `FilterTypeSelection Field Here for ${item?.name} (${item?.type})`}
                {item.isSelected &&
                  `FilteredValue Field Here for ${item?.name}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnFiltering;
