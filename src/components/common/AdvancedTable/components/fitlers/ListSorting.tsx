import React, { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import tableResponse from "@/constants/tables";

type Item = {
  id: number;
  label: string;
  isSelected: boolean;
  isSticky: boolean;
};

type Props = {};

// Memoized Sortable Item
const SortableItem = React.memo(
  ({
    item,
    handlePinToggle,
    handleClose,
  }: {
    item: Item;
    handlePinToggle: (id: number) => void;
    handleClose: (id: number) => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1, // Make the item transparent while dragging
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 bg-white border rounded mb-2 shadow-sm"
      >
        <span className="text-caption">{item.label}</span>
        <div className="flex items-center gap-2">
          <button
            className={clsx(
              "p-1 rounded",
              item.isSticky ? "bg-purple-500 text-white" : "bg-gray-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handlePinToggle(item.id);
            }}
          >
            {item.isSticky ? "Pinned" : "Pin"}
          </button>
          <button
            className="p-1 bg-red-500 text-white rounded"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(item.id);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
);

const ListSorting = (props: Props) => {
  const [items, setItems] = useState<Item[]>(
    tableResponse.listConfig.groups[0].meta.map((item: any) => ({
      ...item,
      isSelected: true,
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

  const handlePinToggle = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isSticky: !item.isSticky } : item
      )
    );
  }, []);

  const handleClose = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isSelected: false } : item
      )
    );
  }, []);

  const handleDragEnd = useCallback(({ active, over }: any) => {
    setItems((prevItems) => {
      const activeIndex = prevItems.findIndex((item) => item.id === active.id);

      if (!over) {
        return prevItems.map((item, index) =>
          index === activeIndex ? { ...item, isSelected: false } : item
        );
      }

      const overIndex = prevItems.findIndex((item) => item.id === over.id);

      return arrayMove(prevItems, activeIndex, overIndex);
    });
  }, []);

  const selectedItems = useMemo(
    () => items.filter((item) => item.isSelected),
    [items]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  return (
    <div className="flex justify-between gap-8">
      {/* Left: Checkbox List */}
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-4">General</h3>
        <div className="flex gap-y-6 flex-wrap">
          {items.map((item) => (
            <div key={item.id} className="flex w-full lg:w-1/2 items-baseline gap-2 mb-2">
              <input
                type="checkbox"
                checked={item.isSelected}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <span className="text-caption">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Drag and Drop */}
      <div className="w-[320px]">
        <h3 className="text-lg font-bold mb-4">Sort order (drag & drop)</h3>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={selectedItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={clsx("p-4 border rounded min-h-[200px]")}>
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    handlePinToggle={handlePinToggle}
                    handleClose={handleClose}
                  />
                ))
              ) : (
                <p className="text-gray-500">Drag items here</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ListSorting;
