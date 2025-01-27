import React, { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { BsPinAngle } from "react-icons/bs";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import tableResponse from "@/constants/tables";
import Checkbox from "@/components/common/CheckBox";
import { DragIcon, PinnedIcon } from "@/assets/Svgs";
import IconButton from "@/components/common/IconButton";
import { MdClose } from "react-icons/md";

type Item = {
  id: number;
  label: string;
  isSelected: boolean;
  isSticky: boolean;
};

type Group = {
  id: number;
  name: string;
  meta: Item[];
};

type Props = {};

const SortableItem = React.memo(
  ({
    item,
    handlePinToggle,
    handleClose,
  }: {
    item: Item;
    handlePinToggle: (itemId: number) => void;
    handleClose: (itemId: number) => void;
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
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          "flex items-center justify-between p-2 bg-white border rounded mb-2 shadow-sm group"
        )}
      >
        <div
          className="flex items-center gap-3 flex-1"
          {...listeners}
          {...attributes}
        >
          <div
            className={
              item.isSticky
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
          >
            <DragIcon />
          </div>
          <span className="text-caption">{item.label}</span>
        </div>
        <div
          className={clsx(
            "flex items-center gap-2 transition-opacity",
            item.isSticky ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="flex items-center gap-1">
            <IconButton
              className={clsx("p-1 hover:bg-purple-20")}
              onClick={(e) => {
                e.stopPropagation();
                handlePinToggle(item.id);
              }}
            >
              {item.isSticky ? <PinnedIcon /> : <BsPinAngle />}
            </IconButton>
            <div className="bg-gray-300 w-[1px] h-5"></div>
            <IconButton
              className="p-1 hover:bg-red-200"
              onClick={(e) => {
                e.stopPropagation();
                handleClose(item.id);
              }}
            >
              <MdClose />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
);

const ListSorting = (props: Props) => {
  const [groups, setGroups] = useState<Group[]>(
    tableResponse.listConfig.groups.map((group: any) => ({
      ...group,
      meta: group.meta.map((item: any) => ({
        ...item,
        isSelected: false,
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

  const handlePinToggle = useCallback((groupId: number, itemId: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              meta: group.meta.map((item) =>
                item.id === itemId
                  ? { ...item, isSticky: !item.isSticky }
                  : item
              ),
            }
          : group
      )
    );
  }, []);

  const handleClose = useCallback((groupId: number, itemId: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              meta: group.meta.map((item) =>
                item.id === itemId ? { ...item, isSelected: false } : item
              ),
            }
          : group
      )
    );
  }, []);

  const handleDragEnd = useCallback(({ active, over }: any) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        meta: arrayMove(
          group.meta,
          group.meta.findIndex((item) => item.id === active.id),
          group.meta.findIndex((item) => item.id === over.id)
        ),
      }))
    );
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.id} className="flex justify-between gap-8">
          {/* Left: Checkbox List */}
          <div className="flex-1">
            <h3 className="text-caption font-semibold text-grey-100 pb-4 border-b border-light-gray">
              {group.name}
            </h3>
            <div className="flex gap-y-6 flex-wrap mt-4">
              {group.meta.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full lg:w-1/2 items-baseline gap-2 mb-2"
                >
                  <Checkbox
                    checked={item.isSelected}
                    onChange={() => handleCheckboxChange(group.id, item.id)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Drag and Drop */}
          <div className="w-[320px]">
            <h3 className="text-caption font-semibold mb-4 text-grey-100">
              Sort order (drag & drop)
            </h3>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={group.meta
                  .filter((item) => item.isSelected)
                  .map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={clsx("p-4 border rounded min-h-[200px]")}>
                  {group.meta.filter((item) => item.isSelected).length > 0 ? (
                    group.meta
                      .filter((item) => item.isSelected)
                      .map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          handlePinToggle={(id) =>
                            handlePinToggle(group.id, id)
                          }
                          handleClose={(id) => handleClose(group.id, id)}
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
      ))}
    </div>
  );
};

export default ListSorting;
